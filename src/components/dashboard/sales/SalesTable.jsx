import React from "react";
import { useSale } from "../../../context/sale/SaleContext";

export default function RecentSales({ sales = [] }) {
  const { updateSaleStatus, getSales } = useSale();

  const handleCancel = (saleId) => {
    const confirm = window.confirm("¿Seguro que deseas anular esta venta?");
    if (!confirm) return;

    updateSaleStatus(saleId, "canceled");
    getSales({page:1, limit:20, forceRefresh:true,status:"all"})
  };

  // Función para formatear fecha y hora en formato local
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Enero es 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (!sales.length) return <p>No hay ventas recientes.</p>;

  return (
    <div>
      <h2>Últimas Ventas</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Total</th>
            <th>RUC</th>
            <th>Pago</th>
            <th>Estado</th>
            <th>Creado Por</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td>{formatDate(sale.date)}</td>
              <td>
                {sale.products.map((p) => (
                  <div key={p._id}>
                    {p.name} × {p.quantity}
                  </div>
                ))}
              </td>
              <td>${sale.totalAmount.toFixed(2)}</td>
              <td>{sale.ruc}</td>
              <td>{sale.paymentMethod}</td>
              <td>{sale.status}</td>
              <td>{sale.user.name}</td>
              <td>
                {sale.status !== "canceled" && (
                  <button
                    onClick={() => handleCancel(sale._id)}
                    className="text-red-600 hover:underline"
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
