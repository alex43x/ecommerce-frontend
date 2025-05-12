import React, { useEffect, useState } from "react";
import { useSale } from "../../context/sale/SaleContext";
import ProductFormModal from "../dashboard/ProductFormModal";
import OrderDetail from "./OrderConfirm";

export default function PendingSales() {
  const { getSales, sales, updateSaleStatus } = useSale();
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [order, setOrder] = useState();

  useEffect(() => {
    getSales({ page: 1, limit: 20, status: "pending" });
  }, []);

  const handleUpdate = async (saleId, newStatus) => {
    await updateSaleStatus(saleId, newStatus);
    getSales({ page: 1, limit: 20, status: "pending" }); // refresca la lista
  };

  return (
    <div>
      <h1>Órdenes Pendientes:</h1>
      {sales && sales.length > 0 ? (
        sales.map((sale, index) => (
          <section
            key={sale._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2>Orden N° {index + 1}</h2>
            <p>
              <strong>Total:</strong> {sale.totalAmount} Gs
            </p>
            <p>
              <strong>Cliente:</strong> {sale.customer?.name || "Sin nombre"}
            </p>
            <p>
              <strong>Estado:</strong> {sale.status}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul>
              {sale.products?.flat().map((item, i) => (
                <li key={i}>
                  x{item.quantity} {item.name} ({item.totalPrice} Gs)
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => {
                  setOrder(sale), setConfirmOrder(true);
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => handleUpdate(sale._id, "canceled")}
                style={{ marginLeft: "1rem" }}
              >
                Cancelar
              </button>
            </div>
          </section>
        ))
      ) : (
        <p>No hay órdenes pendientes.</p>
      )}
      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => {
          setConfirmOrder(false);
        }}
      >
        <OrderDetail
          onExit={() => setConfirmOrder(false)}
          saleData={order}
        ></OrderDetail>
      </ProductFormModal>
    </div>
  );
}
