import React from "react";
import Swal from "sweetalert2";

export default function RecentSales({ sales = [], onCancel }) {
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
      bg: "bg-green-200",
      text: "text-green-800",
    },
    pending: {
      label: "Pendiente",
      bg: "bg-yellow-200",
      text: "text-yellow-800",
    },
    canceled: { label: "Cancelado", bg: "bg-red-200", text: "text-red-800" },
  };

  if (!sales.length) return <p>No hay ventas recientes.</p>;

  return (
    <div>
      <table className="w-full mt-2">
        <thead>
          <tr className="border-b-2 border-neutral-300">
            <th className="w-[135px] text-left align-top">Fecha y Hora</th>
            <th className="w-[250px] text-left">Productos</th>
            <th>Total</th>
            <th>RUC</th>
            <th>Método de Pago</th>
            <th>Estado</th>
            <th>Registrado Por</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id} className="border-b-2 border-neutral-300">
              <td className="text-left align-top py-2 font-medium">
                {formatDate(sale.date)}
              </td>
              <td>
                {sale.products.map((p) => (
                  <div
                    key={p._id}
                    className="flex justify-between w-[250px] my-2"
                  >
                    {p.name}
                    <div className="px-2 mr-4 rounded-md bg-green-200">
                      <p className="text-sm text-center text-green-950 font-medium">
                        x{p.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </td>
              <td>₲ {sale.totalAmount.toFixed()}</td>
              <td className="px-2">{sale.ruc}</td>
              <td className="capitalize px-2">{sale.paymentMethod}</td>
              <td className="text-center pr-2">
                <p
                  className={`px-1 py-1 rounded-md text-sm font-semibold w-11/12 ${
                    statusLabels[sale.status]?.bg || "bg-gray-200"
                  } ${statusLabels[sale.status]?.text || "text-gray-800"}`}
                >
                  {statusLabels[sale.status]?.label || sale.status}
                </p>
              </td>
              <td>{sale.user.name}</td>
              <td>
                {sale.status !== "canceled" && (
                  <button
                    onClick={() => handleCancel(sale._id)}
                    className="px-3 py-2 rounded-md text-sm font-semibold bg-red-200 text-red-800 hover:bg-red-300"
                  >
                    Anular
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
