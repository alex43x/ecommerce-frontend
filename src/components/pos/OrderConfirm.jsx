import React, { useState } from "react";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { useSale } from "../../context/sale/SaleContext";

export default function OrderDetail({ onExit = () => {}, saleData = null }) {
  const { cart, totalAmount, paymentMethod } = useCart();
  const { user } = useAuth();
  const { createSale, updateSaleStatus } = useSale();
  const [ruc, setRuc] = useState(saleData?.ruc || "");

  const items = saleData?.products || cart;
  const total = saleData?.totalAmount || totalAmount;
  const method = saleData?.paymentMethod || paymentMethod;
  const seller = saleData?.user?.name || user.name;

  const handleSave = async () => {
    if (saleData) {
      // Confirmar una venta pendiente
      await updateSaleStatus(saleData._id, "completed",ruc);
    } else {
      // Crear una nueva venta
      const sale = {
        products: cart,
        totalAmount,
        ruc,
        paymentMethod,
        iva: Math.ceil(totalAmount / 11),
        user: user.id,
        status: "completed",
      };
      try {
        await createSale(sale);
      } catch (e) {
        console.error(e);
      }
    }
    onExit();
  };

  return (
    <div>
      <h1>Detalles de la venta</h1>
      <label>
        RUC:{" "}
        <input
          required
          value={ruc}
          onChange={(e) => setRuc(e.target.value)}
          type="text"
          
        />
      </label>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>x{item.quantity}</td>
              <td>{item.totalPrice || item.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
      <p>Método de Pago: {method}</p>
      <p>Vendedor: {seller}</p>
      <button type="button" onClick={onExit}>
        Cancelar
      </button>
      <button type="button" onClick={handleSave}>
        Confirmar Venta
      </button>
    </div>
  );
}
