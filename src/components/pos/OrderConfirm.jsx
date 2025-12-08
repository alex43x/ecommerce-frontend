import { useState, useMemo, useCallback } from "react";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { useSale } from "../../context/sale/SaleContext";
import { useCustomer } from "../../context/customer/CustomerContext";
import Swal from "sweetalert2";
import CustomerForm from "../dashboard/customers/NewCustomerForm";

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
  const { createSale, getSales, updateSale, loading } = useSale();
  const { searchCustomerByRuc } = useCustomer();
  const [activeMethod, setActiveMethod] = useState("cash");
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isPendingOrOrdered = useMemo(
    //Bandera para saber si es nueva venta o venta a completar
    () => saleData?.status === "pending" || saleData?.status === "ordered",
    [saleData]
  );
  const [inFocus, setInFocus] = useState(
    //Input en el cual se esta enfocando
    !isPendingOrOrdered ? "ruc" : "received"
  );
  const [formState, setFormState] = useState({
    ruc: saleData?.ruc || "",
    received: 0,
    multi: false,
    paymentError: false,
  });

  const [customerName, setCustomerName] = useState(
    saleData?.status === "ordered" ? saleData.customerName : ""
  );
  const [customerRUC, setCustomerRUC] = useState(0);
  const [multiPayments, setMultiPayments] = useState(
    paymentOptions.map((opt) => ({ paymentMethod: opt.value, totalAmount: 0 }))
  );

  // Cálculos memoizados
  const {
    items,
    total,
    amountPaid,
    remainingAmount,
    vuelto,
    totalNewPayments,
  } = useMemo(() => {
    const items = saleData?.products || cart; // Productos de la venta
    const total = saleData?.totalAmount || Number(totalAmount); // Costo total de la venta

    // Monto ya pagado - solo para ventas a completar
    const amountPaid =
      saleData?.payment?.reduce((sum, p) => sum + p.totalAmount, 0) || 0;

    // Restante por pagar - solo para ventas a completar
    const remainingAmount = total - amountPaid;

    // Nuevos pagos
    const totalNewPayments = formState.multi
      ? multiPayments.reduce((sum, p) => sum + p.totalAmount, 0)
      : isPendingOrOrdered
      ? formState.received
      : Math.min(formState.received, total);

    // Vuelto: solo si es pago único
    const vuelto = !formState.multi
      ? Math.max(
          0,
          (isPendingOrOrdered ? amountPaid : 0) + formState.received - total
        )
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

  const handleKeyPress = useCallback(
    (num) => {
      if (num === 11) num = "000";

      // Priorizar RUC
      if (inFocus === "ruc") {
        setFormState((prev) => ({
          ...prev,
          ruc: `${prev.ruc}${num}`,
        }));
        return;
      }

      // Pago único (independiente de isPendingOrOrdered)
      if (!formState.multi) {
        setFormState((prev) => ({
          ...prev,
          [inFocus]: parseInt(`${prev[inFocus]}${num}`) || 0,
        }));
        return;
      }

      // Pago múltiple
      const otherPaymentsTotal = multiPayments
        .filter((p) => p.paymentMethod !== inFocus)
        .reduce((sum, p) => sum + p.totalAmount, 0);

      const maxAllowed = isPendingOrOrdered
        ? remainingAmount - otherPaymentsTotal
        : total - otherPaymentsTotal;

      setMultiPayments((prev) =>
        prev.map((item) => {
          if (item.paymentMethod === inFocus) {
            const newAmount = parseInt(`${item.totalAmount}${num}`) || 0;
            return {
              ...item,
              totalAmount: newAmount > maxAllowed ? maxAllowed : newAmount,
            };
          }
          return item;
        })
      );
    },
    [
      formState,
      inFocus,
      multiPayments,
      isPendingOrOrdered,
      remainingAmount,
      total,
    ]
  );

  const handleClear = useCallback(() => {
    if (!formState.multi) {
      if (inFocus === "ruc") {
        setFormState((prev) => ({
          ...prev,
          ruc: prev.ruc.slice(0, -1), // Elimina el último carácter
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          [inFocus]: Math.floor(prev[inFocus] / 10), // Borra último dígito numérico
        }));
      }
    } else {
      setMultiPayments((prev) =>
        prev.map((item) =>
          item.paymentMethod === inFocus
            ? {
                ...item,
                totalAmount: Math.floor(item.totalAmount / 10),
              }
            : item
        )
      );
    }
  }, [formState.multi, inFocus]);

  const parseNumeric = (raw) => {
    //Para evitar valores prohibidos
    const numericValue = String(raw).replace(/[^0-9]/g, "");
    const cleaned =
      numericValue.startsWith("0") && numericValue.length > 1
        ? numericValue.replace(/^0+/, "")
        : numericValue || "0";

    return parseInt(cleaned, 10) || 0;
  };

  const handleReceivedChange = useCallback((e) => {
    //Manejo - Pago con un solo método
    const num = parseNumeric(e.target.value);
    setFormState((prev) => ({
      ...prev,
      received: num,
    }));
  }, []);

  const handlePaymentChange = useCallback(
    //Manejo - Pago con pago múltiples
    (method, rawValue) => {
      let num = parseNumeric(rawValue);

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

  const getValidPayments = useCallback(() => {
    //Obtiene los valores para armar payments
    const timestamp = new Date().toISOString();

    if (formState.multi) {
      return multiPayments
        .filter((p) => p.totalAmount > 0)
        .map((p) => {
          const otherPaymentsTotal = multiPayments
            .filter((x) => x.paymentMethod !== p.paymentMethod)
            .reduce((sum, x) => sum + x.totalAmount, 0);

          const maxAllowed = isPendingOrOrdered
            ? remainingAmount - otherPaymentsTotal
            : total - otherPaymentsTotal;

          const safeAmount = Math.min(p.totalAmount, maxAllowed);

          return {
            ...p,
            totalAmount: safeAmount,
            date: timestamp,
          };
        });
    }

    // caso single
    if (formState.received > 0) {
      const maxAllowed = isPendingOrOrdered ? remainingAmount : total;
      return [
        {
          paymentMethod: paymentMethod || activeMethod,
          totalAmount: Math.min(formState.received, maxAllowed),
          date: timestamp,
        },
      ];
    }

    return [];
  }, [
    formState.multi,
    formState.received,
    multiPayments,
    isPendingOrOrdered,
    remainingAmount,
    total,
    activeMethod,
    paymentMethod,
  ]);

  const buildPaymentData = useCallback(() => {
    //Construye payments
    const existingPayments = isPendingOrOrdered ? saleData.payment || [] : [];
    const newPayments = getValidPayments();
    return [...existingPayments, ...newPayments];
  }, [isPendingOrOrdered, saleData, getValidPayments]);

  // Función para buscar cliente por RUC
  const handleRucSearch = async () => {
    const ruc = formState.ruc.trim();

    if (!ruc) return;
    try {
      const customers = await searchCustomerByRuc(ruc);

      if (customers.length > 0) {
        const foundCustomer = customers[0];
        setCustomerName(foundCustomer.razonSocial);
        setCustomerRUC(foundCustomer.ruc);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Cliente encontrado",
          html: `Nombre: <b>${foundCustomer.razonSocial}</b><br>RUC: <b>${foundCustomer.ruc}</b>`,
          showConfirmButton: false,
          timer: 3500,
          background: "#e9f7ef",
          iconColor: "#057c37",
        });

        setInFocus(formState.multi ? activeMethod : "received");
      }
    } catch {
      Swal.fire({
        title: "No se pudo encontrar cliente",
        text: "Ruc no válido",
        icon: "error",
        confirmButtonColor: "#057c37",
      });
    }
  };
  const handleSave = useCallback(async () => {
    // Validación de RUC
    if (
      (saleData?.status === "pending" && !formState.ruc.trim()) ||
      customerName === ""
    ) {
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa un RUC válido",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        iconColor: "#f59e0b", // color warning
      });
    }

    // Solo los pagos nuevos
    const newPayments = getValidPayments();
    const newPaymentsTotal = newPayments.reduce(
      (sum, p) => sum + p.totalAmount,
      0
    );

    // Total pagado considerando pagos anteriores
    const totalPaid = isPendingOrOrdered
      ? amountPaid + newPaymentsTotal
      : newPaymentsTotal;

    // Validación de monto suficiente
    if (totalPaid < total) {
      setFormState((prev) => ({ ...prev, paymentError: true }));
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Monto insuficiente",
        text: `El ${
          isPendingOrOrdered ? "pago total" : "pago"
        } (₲ ${totalPaid.toLocaleString()}) no cubre el ${
          isPendingOrOrdered ? "saldo" : "total"
        } (₲ ${total.toLocaleString()})`,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        iconColor: "#dc2626", // rojo error
      });
    }

    setFormState((prev) => ({ ...prev, paymentError: false }));

    try {
      if (isPendingOrOrdered) {
        //Ventas reserva-ordenadas
        // Combina pagos anteriores y nuevos para enviar al backend
        const auxGet=saleData?.status
        const updatedSale = {
          ...saleData,
          user: saleData.user._id,
          payment: [...(saleData.payment || []), ...newPayments],
          status: "completed",
          stage: "delivered",
          ruc: customerRUC || formState.ruc.trim() || "Sin RUC",
          customerName,
        };

        await updateSale(saleData._id, updatedSale);
        await getSales({
          page: 1,
          limit: 14,
          forceRefresh: true,
          startDate: today,
          endDate: today,
          status:auxGet
        });

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Venta completada",
          text: "El pago fue registrado con éxito",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        setPaymentMethod("cash");
      } else {
        // Venta nueva
        console.log(newPayments);
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
          customerName,
          ruc: customerRUC || formState.ruc.trim() || "Sin RUC",
          payment: newPayments,
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
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Venta completada",
          text: "El pago fue registrado con éxito",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setPaymentMethod("cash");
      }

      onExit();
    } catch {
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
    getValidPayments,
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
    customerName,
    customerRUC,
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
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Campo requerido",
          text: "Por favor ingresa un RUC válido",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          iconColor: "#f59e0b", // warning
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
          ruc: customerRUC || formState.ruc.trim() || "Sin RUC",
          customerName,
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
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Guardado",
          text: `Venta guardada como ${hasPayments ? "pedido" : "reserva"}`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#e9f7ef",
          iconColor: "#057c37",
        });

        setPaymentMethod("cash");
        onExit();
      } catch {
        Swal.fire({
          title: "Error",
          text: "No se pudo guardar la venta pendiente",
          icon: "error",
          confirmButtonColor: "#057c37",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    customerName,
  ]);

  const formatCurrency = (
    value //Para formatear en guaranies
  ) => value.toLocaleString("es-PY", { style: "currency", currency: "PYG" });

  return (
    <div className="w-[670px]">
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
              <p>{formState.multi ? "Monto restante" : "Vuelto"}</p>
              <p className="text-green-900">
                {formState.multi
                  ? formatCurrency(
                      isPendingOrOrdered
                        ? Math.max(0, remainingAmount - totalNewPayments)
                        : Math.max(0, total - totalNewPayments)
                    )
                  : vuelto > 0
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
                  disabled={saleData?.status == "ordered"}
                  onKeyDown={(e) => e.key === "Enter" && handleRucSearch()}
                  onFocus={() => {
                    setInFocus("ruc");
                  }}
                  type="text"
                  className="px-2 py-1 w-full bg-neutral-50"
                  placeholder="Ingrese RUC"
                />
                <button
                  className="bg-green-200 active:bg-green-300 border border-green-800 text-green-800"
                  onClick={() => {
                    handleRucSearch();
                  }}
                >
                  Buscar...
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

            <>
              <div className="mb-2 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="multi"
                    className="w-7 h-7"
                    checked={formState.multi}
                    onChange={() => {
                      const newMulti = !formState.multi;
                      setFormState((prev) => ({
                        ...prev,
                        multi: newMulti,
                      }));
                      setInFocus(!newMulti ? "received" : "cash");
                      setActiveMethod("cash");
                    }}
                  />
                  <label htmlFor="multi">Pago Múltiple</label>
                </div>
                {formState.multi && (
                  <p className="text-right text-green-800 font-semibold mt-1">
                    Restante:{" "}
                    {formatCurrency(
                      isPendingOrOrdered
                        ? remainingAmount - totalNewPayments
                        : total - totalNewPayments
                    )}
                  </p>
                )}
              </div>
            </>

            {formState.multi ? (
              <div className="space-y-2 ">
                <div className="flex bg-neutral-200 justify-between mt-3">
                  {paymentOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      className={`flex items-center justify-center py-2 px-2 rounded-lg ${
                        activeMethod === value
                          ? "bg-green-200 border border-green-800 text-green-800"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveMethod(value);
                        setInFocus(value);
                      }}
                    >
                      <p>{label}</p>
                    </button>
                  ))}
                </div>
                {paymentOptions.map(({ value, label }) => (
                  <div key={value} className="items-center gap-2">
                    <input
                      type="text"
                      className="px-2 py-2 mt-1 w-full border border-neutral-400 rounded bg-neutral-50"
                      placeholder={`Monto ${label}`}
                      min={0}
                      max={
                        isPendingOrOrdered
                          ? remainingAmount - totalNewPayments
                          : total - totalNewPayments
                      }
                      hidden={activeMethod !== value}
                      value={
                        multiPayments.find((p) => p.paymentMethod === value)
                          ?.totalAmount || ""
                      }
                      onChange={(e) => {
                        handlePaymentChange(value, e.target.value);
                        console.log(value);
                      }}
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
                      onClick={() => {
                        setPaymentMethod(value);
                        console.log(value, formState);
                        if (!isPendingOrOrdered) {
                          // Venta nueva
                          setFormState((prev) => ({
                            ...prev,
                            received: value === "cash" ? 0 : totalAmount,
                          }));
                        } else {
                          // Orden pendiente
                          setFormState((prev) => ({
                            ...prev,
                            received: value === "cash" ? 0 : total - amountPaid,
                          }));
                        }
                      }}
                    >
                      <p>{label}</p>
                    </button>
                  ))}
                </div>

                <input
                  className="text-center text-xl font-medium w-full py-1 px-3"
                  onChange={handleReceivedChange}
                  value={` ${formatCurrency(Number(formState.received))}`}
                  onFocus={() => {
                    setInFocus("received");
                  }}
                  type="text"
                />
              </div>
            )}
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
              {/*
              <button
                className="bg-green-100 active:bg-green-200 transition text-xl rounded text-green-800 border border-green-800"
                onClick={() => handleKeyPress("-")}
              >
                -
              </button>*/}
              <button
                className="bg-green-100 active:bg-green-200 transition text-xl rounded text-green-800 border border-green-800"
                onClick={() => handleKeyPress(11)}
              >
                000
              </button>
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
              disabled={loading}
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
                disabled={!cart.length || loading}
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
