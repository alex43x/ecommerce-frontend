import React, { useState } from "react";
import Swal from "sweetalert2";
import ProductFormModal from "../../dashboard/products/ProductFormModal";
import OrderDetail from "../../pos/OrderConfirm";

export default function RecentSales({ sales = [], onCancel }) {
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [selectedSale, setSelectedSale] = useState({});
  const handleCancel = async (saleId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción es irreversible y anulará la venta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;
    onCancel(saleId);

    Swal.fire("Anulada", "La venta fue anulada correctamente.", "success");
  };

  const handlePay = (sale) => {
    setConfirmOrder(true);
    setSelectedSale(sale);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const statusLabels = {
    completed: {
      label: "Completado",
      bg: "bg-green-200 border border-green-800",
      text: "text-green-800",
    },
    ordered: {
      label: "Pedido",
      bg: "bg-lime-200 border border-lime-800",
      text: "text-lime-800",
    },
    pending: {
      label: "Pendiente",
      bg: "bg-yellow-200 border border-yellow-800",
      text: "text-yellow-800",
    },
    canceled: {
      label: "Cancelado",
      bg: "bg-orange-200 border border-orange-800",
      text: "text-orange-800",
    },
    annulled: {
      label: "Anulado",
      bg: "bg-red-200 border border-red-800",
      text: "text-red-800",
    },
  };

  const methodMap = {
    card: "Tarjeta",
    cash: "Efectivo",
    qr: "QR",
    transfer: "Transferencia",
  };

  if (!sales.length)
    return (
      <p className="text-center font-medium text-neutral-600 text-3xl mt-8">
        No se encontraron ventas con esos filtros.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <div className="max-h-[500px] overflow-y-auto  rounded-lg">
        <table className="w-full mt-2 ">
          <thead className="sticky top-0 bg-neutral-200 z-10">
            <tr className="border-b-2 border-neutral-300">
              <th className="min-w-[135px] text-left align-top text-green-800 font-medium text-md py-2 pl-1">
                Fecha y Hora
              </th>
              <th className="min-w-[220px] text-left text-green-800 font-medium text-md ">
                Productos
              </th>
              <th className="min-w-[80px] text-green-800 font-medium text-md">
                Total
              </th>
              <th className="text-green-800 font-medium text-md pl-2">RUC</th>
              <th className=" min-w-[160px] text-green-800 font-medium text-md pl-2">
                Método(s) de Pago
              </th>
              <th className="min-w-[100px] text-green-800 font-medium text-md">
                Estado
              </th>
              <th className="min-w-[130px] text-green-800 font-medium text-md">
                Registrado Por
              </th>
              <th className="text-green-800 font-medium text-md">Acción</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale._id}
                className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition"
              >
                <td className="text-left align-top py-2 pl-1 font-medium">
                  {formatDate(sale.date)}
                </td>
                <td className="flex flex-col items-start">
                  {sale.products.map((p) => (
                    <div
                      key={p._id}
                      className="flex justify-between w-[220px] my-2 items-start"
                    >
                      {p.name}
                      <div className=" py-1 mr-4 rounded-md bg-green-200 border border-green-800 w-10">
                        <p className="text-sm text-center text-green-800 font-medium">
                          x {p.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>
                <td>
                  {sale.totalAmount.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </td>
                <td className="px-2">{sale.ruc}</td>
                <td className="capitalize px-2">
                  <div className="">
                    {sale.payment.map((p, index) => (
                      <div
                        key={index}
                        className="bg-green-200 border border-green-800 px-2 rounded w-fit my-2 py-1 text-green-800 font-medium"
                      >
                        {methodMap[p.paymentMethod] || p.paymentMethod}:{" "}
                        {p.totalAmount.toLocaleString("es-PY", {
                          style: "currency",
                          currency: "PYG",
                        })}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="text-center pr-2">
                  <p
                    className={`px-1 py-1 rounded-md text-sm font-semibold w-11/12 ${
                      statusLabels[sale.status]?.bg || "bg-gray-200"
                    } ${statusLabels[sale.status]?.text || "text-gray-800"}`}
                  >
                    {statusLabels[sale.status]?.label || sale.status}
                  </p>
                </td>
                <td>{sale.user?.name}</td>
                <td>
                  <div className=" flex gap-2">
                    {(sale?.status === "pending" ||
                      sale?.status === "ordered") && (
                      <div>
                        <button
                          onClick={() => handlePay(sale)}
                          className="px-3 py-1 rounded-md text-sm font-semibold bg-green-200 text-green-800 hover:bg-green-300 border border-green-800"
                        >
                          Pagar
                        </button>
                      </div>
                    )}

                    {sale?.status !== "annulled" && (
                      <button
                        onClick={() => handleCancel(sale._id)}
                        className="px-3 py-1 rounded-md text-sm font-semibold bg-red-200 text-red-800 hover:bg-red-300 border border-red-800"
                      >
                        Anular
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => {
          setConfirmOrder(false);
        }}
      >
        <OrderDetail
          onExit={() => setConfirmOrder(false)}
          saleData={selectedSale}
          paymentMode="complete"
        />
      </ProductFormModal>
    </div>
  );
}
