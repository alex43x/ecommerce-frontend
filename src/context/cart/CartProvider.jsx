import React, { useState } from "react";
import Swal from "sweetalert2";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  // Estado para los productos del carrito
  const [cart, setCart] = useState([]);

  // Método de pago seleccionado (por defecto: efectivo)
  const [paymentMethod, setPaymentMethod] = useState("cash");

  /**
   * Agrega un producto al carrito, o actualiza su cantidad si ya existe.
   * Si hay una sola variante llamada "Normal", no se muestra en el nombre del producto.
   */
  const addToCart = ({ product, variant, quantity = 1 }) => {
    const variantName = variant.variantName;
    const productName =
      product.variants.length === 1 && variantName.toLowerCase() === "normal"
        ? product.name
        : `${product.name} ${variantName}`;

    const newItem = {
      productId: product._id,
      name: productName,
      variantId: variant._id,
      price: variant.price,
      quantity,
      iva: (variant.price / 11).toFixed() || 0,
      totalPrice: variant.price * quantity,
    };

    // Actualiza el carrito (agrega o modifica producto existente)
    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (item) => item.variantId === newItem.variantId
      );

      if (index !== -1) {
        const updated = [...prevCart];
        const existing = updated[index];
        const newQty = existing.quantity + quantity;

        if (newQty <= 0) {
          // Si la cantidad es 0 o menor, elimina el producto
          updated.splice(index, 1);
          return updated;
        }

        updated[index] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.price,
          iva: (existing.price / 11).toFixed() * newQty,
        };
        return updated;
      } else {
        // Agrega nuevo producto
        return [...prevCart, newItem];
      }
    });
  };

  /**
   * Elimina un producto del carrito según su ID de variante.
   */
  const removeFromCart = (variantId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.variantId !== variantId)
    );
  };

  /**
   * Calcula el monto total del carrito.
   */
  const totalAmount = cart
    .reduce((sum, item) => sum + item.totalPrice, 0)
    .toFixed();

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        totalAmount,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
