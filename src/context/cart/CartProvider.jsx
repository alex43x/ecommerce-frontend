import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ===============================
  // ESTADOS FISCALES (IVA Paraguay)
  // ===============================
  const [iva10, setIva10] = useState(0);
  const [iva5, setIva5] = useState(0);
  const [gravada10, setGravada10] = useState(0);
  const [gravada5, setGravada5] = useState(0);
  const [exenta, setExenta] = useState(0);

  /**
   * Calcular IVA según tasa
   */
  const calculateIvaAmount = (price, quantity, ivaRate) => {
    const total = price * quantity;

    switch (ivaRate) {
      case 10:
        return Math.round(total / 11);
      case 5:
        return Math.round(total / 21);
      case 0:
      default:
        return 0;
    }
  };

  /**
   * Agregar o actualizar producto
   */
  const addToCart = ({ product, variant, quantity = 1 }) => {
    const variantName = variant.variantName;

    const name =
      product.variants.length === 1 &&
      variantName.toLowerCase() === "normal"
        ? product.name
        : `${product.name} ${variantName}`;

    const ivaRate = product.ivaRate; // SIEMPRE desde producto

    const ivaAmount = calculateIvaAmount(
      variant.price,
      quantity,
      ivaRate
    );

    const newItem = {
      productId: product._id,
      variantId: variant._id,
      quantity,
      name,
      ivaRate,
      ivaAmount,
      totalPrice: variant.price * quantity // IVA incluido
    };

    setCart((prev) => {
      const index = prev.findIndex(
        (item) => item.variantId === newItem.variantId
      );

      if (index !== -1) {
        const updated = [...prev];
        const existing = updated[index];
        const newQty = existing.quantity + quantity;

        if (newQty <= 0) {
          updated.splice(index, 1);
          return updated;
        }

        const newTotal = existing.totalPrice + variant.price * quantity;
        const newIva = calculateIvaAmount(
          variant.price,
          newQty,
          ivaRate
        );

        updated[index] = {
          ...existing,
          quantity: newQty,
          totalPrice: newTotal,
          ivaAmount: newIva
        };

        return updated;
      }

      return [...prev, newItem];
    });
  };

  /**
   * Eliminar producto
   */
  const removeFromCart = (variantId) => {
    setCart((prev) =>
      prev.filter((item) => item.variantId !== variantId)
    );
  };

  /**
   * Recalcular totales fiscales cuando cambia el carrito
   */
  useEffect(() => {
    let _iva10 = 0;
    let _iva5 = 0;
    let _gravada10 = 0;
    let _gravada5 = 0;
    let _exenta = 0;

    cart.forEach((item) => {
      if (item.ivaRate === 10) {
        _gravada10 += item.totalPrice - item.ivaAmount;
        _iva10 += item.ivaAmount;
      } else if (item.ivaRate === 5) {
        _gravada5 += item.totalPrice - item.ivaAmount;
        _iva5 += item.ivaAmount;
      } else {
        _exenta += item.totalPrice;
      }
    });

    setIva10(Math.round(_iva10));
    setIva5(Math.round(_iva5));
    setGravada10(Math.round(_gravada10));
    setGravada5(Math.round(_gravada5));
    setExenta(Math.round(_exenta));
  }, [cart]);

  /**
   * Total general
   */
  const totalAmount = Math.round(
    cart.reduce((sum, item) => sum + item.totalPrice, 0)
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,

        // Totales fiscales por estado
        iva10,
        iva5,
        gravada10,
        gravada5,
        exenta,

        totalAmount,
        paymentMethod,
        setPaymentMethod
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
