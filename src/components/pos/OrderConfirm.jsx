import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { useSale } from "../../context/sale/SaleContext";
import { useCustomer } from "../../context/customer/CustomerContext";
import Swal from "sweetalert2";
import CustomerForm from "./NewCustomerForm"; // Asegúrate de que la ruta sea correcta

// Importar imágenes
import cerrarIcon from "../../images/eliminar.png";
import listoIcon from "../../images/listo.png";
import guardarIcon from "../../images/guardar.png";
import borrarIcon from "../../images/borrar.png";
import cashIcon from "../../images/cash.png";
import cardIcon from "../../images/card.png";
import qrIcon from "../../images/qr.png";
import transferIcon from "../../images/transfer.png";

// Objeto de iconos
const icons = {
  cerrar: cerrarIcon,
  listo: listoIcon,
  guardar: guardarIcon,
  borrar: borrarIcon,
  cash: cashIcon,
  card: cardIcon,
  qr: qrIcon,
  transfer: transferIcon,
};

const paymentOptions = [
  { value: "cash", label: "Efectivo", icon: icons.cash },
  { value: "card", label: "Tarjeta", icon: icons.card },
  { value: "qr", label: "QR", icon: icons.qr },
  { value: "transfer", label: "Transferencia", icon: icons.transfer },
];

export default function OrderDetail({
  onExit = () => {},
  saleData = null,
  mode = "local",
}) {
  const { cart, setCart, totalAmount, paymentMethod, setPaymentMethod } =
    useCart();
  const { user } = useAuth();
  const { createSale, getSales, updateSale } = useSale();
  const { searchCustomers } = useCustomer();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isPendingOrOrdered = useMemo(
    () => saleData?.status === "pending" || saleData?.status === "ordered",
    [saleData]
  );

  const [formState, setFormState] = useState({
    ruc: saleData?.ruc || "",
    received: 0,
    multi: false,
    paymentError: false,
  });

  const [customerName, setCustomerName] = useState("");
  const [multiPayments, setMultiPayments] = useState(
    paymentOptions.map((opt) => ({ paymentMethod: opt.value, totalAmount: 0 }))
  );
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Cálculos memoizados
  const {
    items,
    total,
    amountPaid,
    remainingAmount,
    vuelto,
    totalNewPayments,
  } = useMemo(() => {
    const items = saleData?.products || cart;
    const total = saleData?.totalAmount || Number(totalAmount);
    const amountPaid =
      saleData?.payment?.reduce((sum, p) => sum + p.totalAmount, 0) || 0;
    const remainingAmount = total - amountPaid;

    const totalNewPayments = formState.multi
      ? multiPayments.reduce((sum, p) => sum + p.totalAmount, 0)
      : isPendingOrOrdered
      ? formState.received
      : Math.min(formState.received, total);

    const vuelto =
      !formState.multi && formState.received > total
        ? formState.received - total
        : 0;

    return {
      items,
      total,
      amountPaid,
      remainingAmount,
      vuelto,
      totalNewPayments,
    };
  }, [
    saleData,
    cart,
    totalAmount,
    formState.multi,
    formState.received,
    multiPayments,
    isPendingOrOrdered,
  ]);

  // Funciones de manejo
  const handleKeyPress = useCallback((num) => {
    setFormState((prev) => ({
      ...prev,
      received: parseInt(`${prev.received}${num}`),
    }));
  }, []);

  const handleClear = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      received: Math.floor(prev.received / 10),
    }));
  }, []);

  const handleReceivedChange = useCallback((e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    const cleanedValue =
      numericValue.startsWith("0") && numericValue.length > 1
        ? numericValue.replace(/^0+/, "")
        : numericValue || "0";

    setFormState((prev) => ({
      ...prev,
      received: parseInt(cleanedValue, 10) || 0,
    }));
  }, []);

  const handlePaymentChange = useCallback(
    (method, value) => {
      const numericValue = value.replace(/[^0-9]/g, "");
      let cleaned =
        numericValue.startsWith("0") && numericValue.length > 1
          ? numericValue.replace(/^0+/, "")
          : numericValue || "0";

      let num = parseInt(cleaned, 10) || 0;

      const otherPaymentsTotal = multiPayments
        .filter((p) => p.paymentMethod !== method)
        .reduce((sum, p) => sum + p.totalAmount, 0);

      const maxAllowed = isPendingOrOrdered
        ? remainingAmount - otherPaymentsTotal
        : total - otherPaymentsTotal;

      if (num > maxAllowed) num = maxAllowed;

      setMultiPayments((prev) =>
        prev.map((p) =>
          p.paymentMethod === method ? { ...p, totalAmount: num } : p
        )
      );
    },
    [multiPayments, isPendingOrOrdered, remainingAmount, total]
  );

  const getValidPayments = useCallback(
    () => multiPayments.filter((p) => p.totalAmount > 0),
    [multiPayments]
  );

  const buildPaymentData = useCallback(() => {
    if (isPendingOrOrdered) {
      const existingPayments = saleData.payment || [];
      const timestamp = new Date().toISOString();
      const newPayments = getValidPayments().map((p) => ({
        ...p,
        date: timestamp,
      }));
      return [...existingPayments, ...newPayments];
    }

    return formState.multi
      ? getValidPayments()
      : formState.received > 0
      ? [
          {
            paymentMethod,
            totalAmount: Math.min(formState.received, total),
          },
        ]
      : [];
  }, [
    isPendingOrOrdered,
    saleData,
    getValidPayments,
    formState.multi,
    formState.received,
    paymentMethod,
    total,
  ]);

  // Función para manejar el cliente creado
  const handleCustomerCreated = (newCustomer) => {
    setFormState((prev) => ({ ...prev, ruc: newCustomer.ruc }));
    setCustomerName(newCustomer.name);
    setShowCustomerForm(false);
    Swal.fire({
      title: "Cliente registrado!",
      text: `${newCustomer.name} ha sido registrado correctamente`,
      icon: "success",
      confirmButtonColor: "#057c37",
    });
  };

  useEffect(() => {
    console.log("CustomerName: ", customerName);
  }, [customerName]);
  // Función para buscar cliente por RUC
  const handleRucSearch = async () => {
    const ruc = formState.ruc.trim();
    console.log(ruc);
    if (!ruc) return;
    try {
      const customers = await searchCustomers(ruc);
      if (customers.length > 0) {
        const foundCustomer = customers[0];
        setCustomerName(foundCustomer.name);
        Swal.fire({
          title: "Cliente encontrado",
          html: `Nombre: <b>${foundCustomer.name}</b><br>RUC: <b>${foundCustomer.ruc}</b>`,
          icon: "success",
          confirmButtonColor: "#057c37",
        });
      } else {
        const { value: action } = await Swal.fire({
          title: "Cliente no registrado",
          text: "¿Qué desea hacer?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Registrar nuevo cliente",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#057c37",
        });

        if (action) {
          // SweetAlert2 devuelve true cuando se confirma
          setShowCustomerForm(true);
        }
      }
    } catch (error) {
      console.error("Error buscando cliente:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo buscar el cliente",
        icon: "error",
        confirmButtonColor: "#057c37",
      });
    }
  };

  // Función handleSave
  const handleSave = useCallback(async () => {
    if ((!isPendingOrOrdered && !formState.ruc.trim()) || customerName == "") {
      return Swal.fire({
        title: "Campo requerido",
        text: "Por favor ingresa un RUC válido",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#057c37",
      });
    }

    const currentPayments = buildPaymentData();
    const totalPaid = isPendingOrOrdered
      ? amountPaid + currentPayments.reduce((sum, p) => sum + p.totalAmount, 0)
      : currentPayments.reduce((sum, p) => sum + p.totalAmount, 0);

    if (totalPaid < total) {
      setFormState((prev) => ({ ...prev, paymentError: true }));
      return Swal.fire({
        title: "Monto insuficiente",
        text: `El ${
          isPendingOrOrdered ? "pago total" : "pago"
        } (₲ ${totalPaid.toLocaleString()}) no cubre el ${
          isPendingOrOrdered ? "saldo" : "total"
        } (₲ ${total.toLocaleString()})`,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#057c37",
      });
    }

    setFormState((prev) => ({ ...prev, paymentError: false }));

    try {
      if (isPendingOrOrdered) {
        const updatedSale = {
          ...saleData,
          payment: currentPayments,
          status: "completed",
          stage: "delivered",
          ruc: formState.ruc.trim() || "Sin RUC",
        };

        await updateSale(saleData._id, updatedSale);
        await getSales({
          page: 1,
          limit: 14,
          forceRefresh: true,
          startDate: today,
          endDate: today,
        });
        Swal.fire({
          title: "Venta completada",
          text: "El pago fue registrado con éxito",
          icon: "success",
          confirmButtonColor: "#057c37",
        });
      } else {
        const newSale = {
          products: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            iva: item.iva,
            totalPrice: item.totalPrice,
            name: item.name,
          })),
          totalAmount,
          ruc: formState.ruc.trim() || "Sin RUC",
          payment: currentPayments,
          iva: Math.round(total / 11),
          user: user.id,
          mode,
          status: "completed",
          stage: "delivered",
        };

        await createSale(newSale);
        await getSales({
          page: 1,
          limit: 20,
          forceRefresh: true,
          startDate: today,
          endDate: today,
        });
        setCart([]);
        Swal.fire({
          title: "Venta completada",
          text: "El pago fue registrado con éxito",
          icon: "success",
          confirmButtonColor: "#057c37",
        });
      }
      onExit();
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al registrar el pago",
        icon: "error",
        confirmButtonColor: "#057c37",
      });
    }
  }, [
    isPendingOrOrdered,
    formState.ruc,
    buildPaymentData,
    amountPaid,
    total,
    saleData,
    updateSale,
    getSales,
    today,
    cart,
    totalAmount,
    user,
    mode,
    createSale,
    setCart,
    onExit,
    customerName
  ]);

  const handleSavePendingSale = useCallback(async () => {
    if (!isPendingOrOrdered) {
      const paymentData = buildPaymentData();
      const hasPayments = paymentData.some((p) => p.totalAmount > 0);
      if (
        (!isPendingOrOrdered && !formState.ruc.trim()) ||
        customerName === ""
      ) {
        return Swal.fire({
          title: "Campo requerido",
          text: "Por favor ingresa un RUC válido",
          icon: "warning",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#057c37",
        });
      }
      try {
        const provisionalSale = {
          products: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            iva: item.iva,
            totalPrice: item.totalPrice,
            name: item.name,
          })),
          totalAmount,
          ruc: formState.ruc.trim() || "Sin RUC",
          payment: paymentData,
          iva: Math.round(total / 11),
          user: user.id,
          status: hasPayments ? "ordered" : "pending",
          mode,
          stage: "processed",
        };

        await createSale(provisionalSale);
        await getSales({
          page: 1,
          limit: 20,
          forceRefresh: true,
          startDate: today,
          endDate: today,
        });
        setCart([]);
        Swal.fire({
          title: "Guardado",
          text: `Venta guardada como ${hasPayments ? "pedido" : "reserva"}`,
          icon: "success",
          confirmButtonColor: "#057c37",
        });
        onExit();
      } catch (e) {
        console.error("Error al guardar venta pendiente:", e);
        Swal.fire({
          title: "Error",
          text: "No se pudo guardar la venta pendiente",
          icon: "error",
          confirmButtonColor: "#057c37",
        });
      }
    }
  }, [
    isPendingOrOrdered,
    buildPaymentData,
    cart,
    totalAmount,
    formState.ruc,
    user,
    mode,
    createSale,
    getSales,
    setCart,
    onExit,
    total,
    today,
    customerName
  ]);

  const formatCurrency = (value) =>
    value.toLocaleString("es-PY", { style: "currency", currency: "PYG" });

  return (
    <div className="w-[670px]">
      {/* Modal para el formulario de cliente */}
      {showCustomerForm && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-neutral-100 rounded-lg p-4 w-[710px] max-w-3xl max-h-[90vh] overflow-y-auto">
            <CustomerForm
              onExit={() => setShowCustomerForm(false)}
              onSuccess={handleCustomerCreated}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between mb-3">
        <h3 className="text-2xl font-bold ml-1 text-green-900">
          {isPendingOrOrdered ? "Completar Pago" : "Pago de Orden"}
        </h3>
        <img
          className="w-5 object-contain cursor-pointer"
          src={icons.cerrar}
          alt="Cerrar"
          onClick={onExit}
        />
      </div>

      <div className="flex">
        <section className="w-1/2 pr-2">
          <div
            className={`p-2 bg-[#dae4e4] rounded-lg overflow-y-auto ${
              isPendingOrOrdered ? "h-60" : "h-76"
            }`}
          >
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-neutral-100">
                  <th className="pb-1">Productos</th>
                  <th>Cant.</th>
                  <th className="flex justify-end">Precio</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="font-medium">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">
                      <div className="bg-green-200 rounded px-2 w-fit text-green-900">
                        x{item.quantity}
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.totalPrice || item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="font-medium mt-4 p-2 bg-[#dae4e4] rounded-lg">
            <div className="flex justify-between w-full my-1">
              <p>Subtotal:</p>
              <p className="text-green-900">{formatCurrency(total / 1.1)}</p>
            </div>
            <div className="flex justify-between my-1">
              <p>IVA 10%</p>
              <p className="text-green-900">{formatCurrency(total / 11)}</p>
            </div>
            <div className="flex justify-between text-xl py-1 mt-1 border-t-2 border-dashed border-neutral-50">
              <p>Total</p>
              <p className="text-green-900">{formatCurrency(total)}</p>
            </div>

            {isPendingOrOrdered && (
              <>
                <div className="flex justify-between my-1">
                  <p>Pagado:</p>
                  <p className="text-green-900">{formatCurrency(amountPaid)}</p>
                </div>
                <div className="flex justify-between my-1">
                  <p>Nuevo pago:</p>
                  <p className="text-green-900">
                    {formatCurrency(totalNewPayments)}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between py-1 border-t-2 border-dashed border-neutral-50">
              <p>{isPendingOrOrdered ? "Falta pagar" : "Vuelto"}</p>
              <p className="text-green-900">
                {isPendingOrOrdered
                  ? formatCurrency(
                      Math.max(0, remainingAmount - totalNewPayments)
                    )
                  : vuelto > 0 && !formState.multi
                  ? formatCurrency(vuelto)
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
        </section>

        <section className="w-1/2 pl-4 flex flex-col h-[460px]">
          <div className="flex-1 overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <label className="font-medium">RUC: </label>
                <input
                  required
                  value={formState.ruc}
                  onChange={(e) => {
                    setFormState((prev) => ({
                      ...prev,
                      ruc: e.target.value,
                    }));
                    setCustomerName("");
                  }}
                  disabled={saleData?.status=="ordered"}
                  onKeyDown={(e) => e.key === "Enter" && handleRucSearch()}
                  type="text"
                  className="px-2 py-1 w-full bg-neutral-50"
                  placeholder="Ingrese RUC"
                />
                <button
                  onClick={() => setShowCustomerForm(true)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm whitespace-nowrap border border-blue-800"
                >
                  + Cliente
                </button>
              </div>

              {customerName && (
                <div className="mt-1 text-sm text-green-800">
                  <strong>Cliente:</strong> {customerName}
                </div>
              )}
              {!isPendingOrOrdered && (
                <div className="text-xs text-gray-500 mt-1">
                  Presione Enter después de ingresar el RUC para buscar
                </div>
              )}
            </div>

            {!isPendingOrOrdered && (
              <>
                <div className="mb-2 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id="multi"
                      className="w-7 h-7"
                      checked={formState.multi}
                      onChange={() =>
                        setFormState((prev) => ({
                          ...prev,
                          multi: !prev.multi,
                        }))
                      }
                    />
                    <label htmlFor="multi">Pago Múltiple</label>
                  </div>
                  {formState.multi && (
                    <p className="text-right text-green-800 font-semibold mt-1">
                      Restante: {formatCurrency(total - totalNewPayments)}
                    </p>
                  )}
                </div>
              </>
            )}

            {formState.multi || isPendingOrOrdered ? (
              <div className="space-y-2">
                {paymentOptions.map(({ value, label, icon }) => (
                  <div key={value} className="items-center gap-2">
                    <div className="flex gap-2 mb-1">
                      <img
                        src={icon}
                        alt={label}
                        className="w-5 object-contain"
                      />
                      <p className="w-20 font-medium">{label}</p>
                    </div>
                    <input
                      type="number"
                      className="px-2 py-1 w-full border rounded bg-neutral-50"
                      placeholder={`Monto ${label}`}
                      min={0}
                      max={
                        isPendingOrOrdered
                          ? remainingAmount - totalNewPayments
                          : total - totalNewPayments
                      }
                      value={
                        multiPayments.find((p) => p.paymentMethod === value)
                          ?.totalAmount || ""
                      }
                      onChange={(e) =>
                        handlePaymentChange(value, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex bg-neutral-200 rounded-lg my-3 justify-between">
                  {paymentOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      className={`flex items-center justify-center py-2 px-2 rounded-lg ${
                        paymentMethod === value
                          ? "bg-green-200 border border-green-800 text-green-800"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod(value)}
                    >
                      <p>{label}</p>
                    </button>
                  ))}
                </div>

                <input
                  className="text-center text-xl font-medium w-full py-1 px-3"
                  onChange={handleReceivedChange}
                  value={` ${formatCurrency(Number(formState.received))}`}
                  type="text"
                />

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      className="bg-green-100 active:bg-green-200 transition text-xl rounded text-green-800 border border-green-800"
                      onClick={() => handleKeyPress(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <div></div>
                  <button
                    className="bg-green-100 active:bg-green-200 transition text-xl rounded text-green-800 border border-green-800"
                    onClick={() => handleKeyPress(0)}
                  >
                    0
                  </button>
                  <button
                    onClick={handleClear}
                    className="bg-red-100 p-2 rounded text-red-800 flex justify-center border border-red-800"
                  >
                    <img
                      className="w-5 object-contain"
                      src={icons.borrar}
                      alt="Borrar"
                    />
                  </button>
                </div>
              </div>
            )}

            {formState.paymentError && (
              <p className="text-red-600 text-sm mt-1">
                La suma de pagos no cubre el total requerido.
              </p>
            )}
          </div>

          <section className="flex gap-2 justify-evenly mt-auto">
            <button
              className="bg-green-200 border border-green-800 rounded-lg text-green-800 flex gap-1 px-2 py-1 min-w-4/12 justify-evenly"
              onClick={handleSave}
            >
              <p>{isPendingOrOrdered ? "Completar Pago" : "Finalizar"}</p>
              <img
                className="w-4 object-contain"
                src={icons.listo}
                alt="Confirmar"
              />
            </button>

            {!isPendingOrOrdered && (
              <button
                disabled={!cart.length}
                className="bg-neutral-100 border border-neutral-800 rounded-lg flex gap-1 px-2 py-1 w-8/12 justify-evenly"
                onClick={handleSavePendingSale}
              >
                <p>Guardar Pendiente</p>
                <img
                  className="w-4 object-contain"
                  src={icons.guardar}
                  alt="Guardar"
                />
              </button>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
