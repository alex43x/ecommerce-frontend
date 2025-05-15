import React, { useState } from "react";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { useSale } from "../../context/sale/SaleContext";

export default function OrderView({ onConfirm = () => {} }) {
  const { cart, totalAmount, removeFromCart, paymentMethod, setPaymentMethod } = useCart();
  const { user } = useAuth();
  const { createSale,getSales } = useSale();
  const [saleMode, setSaleMode] = useState("");

  const handleSavePendingSale = async () => {
    const provisionalSale = {
      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        iva: item.iva,
        totalPrice: item.totalPrice,
        name: item.name, 
      })),
      totalAmount,
      ruc: "Sin RUC",
      paymentMethod,
      iva: (totalAmount / 11).toFixed(),
      user: user.id,
      status: "pending", // importante para filtrarla después
      customer: {
        type: saleMode,
      },
    };

    try {
      await createSale(provisionalSale);
      alert("Orden guardada como pendiente");
      await getSales({page:1,limit:20,forceRefresh:true})
    } catch (e) {
      console.error("Error al guardar venta pendiente:", e);
    }
  };

  return (
    <div>
      <h1>Nueva Orden</h1>

      <section>
        <button type="button" value="local" onClick={(e) => setSaleMode(e.target.value)}>
          En Local
        </button>
        <button type="button" value="carry" onClick={(e) => setSaleMode(e.target.value)}>
          Para Llevar
        </button>
        <button type="button" value="delivery" onClick={(e) => setSaleMode(e.target.value)}>
          Delivery
        </button>
      </section>

      <h2>Productos Seleccionados</h2>
      {cart.map((item) => (
        <section key={item.productId}>
          <p>{item.name}</p>
          <p>x{item.quantity}</p>
          <p>{item.totalPrice}</p>
          <button onClick={() => removeFromCart(item.productId)}>X</button>
        </section>
      ))}

      <p>IVA 10%: {(totalAmount / 11).toFixed()}</p>
      <p>Total: {totalAmount}</p>

      <section>
        <button type="button" value="cash" onClick={(e) => setPaymentMethod(e.target.value)}>
          Efectivo
        </button>
        <button type="button" value="card" onClick={(e) => setPaymentMethod(e.target.value)}>
          Tarjeta
        </button>
        <button type="button" value="qr" onClick={(e) => setPaymentMethod(e.target.value)}>
          QR
        </button>
      </section>

      <section>
        <button
          disabled={paymentMethod === "" || cart.length === 0 || saleMode === ""}
          type="button"
          onClick={onConfirm}
        >
          Confirmar Venta
        </button>
        <button
          disabled={paymentMethod === "" || cart.length === 0 || saleMode === ""}
          type="button"
          onClick={handleSavePendingSale}
        >
          Guardar Venta
        </button>
      </section>
    </div>
  );
}
