import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod,setPaymentMethod]=useState("")


  const addToCart = ({ product, variant, quantity = 1 }) => {
    console.log(variant)
    const variantName = variant.variantName;
    const productName =
      product.variants.length === 1 && variantName.toLowerCase() === "normal"
        ? product.name
        : `${product.name} ${variantName}`;

    const newItem = {
      productId: variant._id,
      name: productName,
      price: variant.price,
      quantity,
      iva: (variant.price / 11).toFixed() || 0,
      totalPrice: variant.price * quantity,
    };
    console.log(quantity, newItem.price);

    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (index !== -1) {
        const updated = [...prevCart];
        const existing = updated[index];
        const newQty = existing.quantity + quantity;

        if (newQty <= 0) {
          updated.splice(index, 1); // Eliminar del carrito
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
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed();

  useEffect(() => {
    console.log(cart);
    console.log(totalAmount);
    console.log(paymentMethod);
  }, [cart,totalAmount]);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart,removeFromCart,totalAmount,paymentMethod,setPaymentMethod }}>
      {children}
    </CartContext.Provider>
  );
};
