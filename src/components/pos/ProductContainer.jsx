import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cart/CartContext";

export default function ProductContainer({ product }) {
  const { cart, addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState({
    _id: product.variants[0]._id,
    variantName: product.variants[0].variantName || "",
    price: product.variants[0].price || 0,
    iva: product.variants[0].iva || 0,
    quantity: 0,
    index: 0,
  });

  // 👉 Cuando cambia el producto, actualiza el estado
  useEffect(() => {
    setSelectedVariant({
      _id: product.variants[0]._id,
      variantName: product.variants[0].variantName || "",
      price: product.variants[0].price || 0,
      iva: product.variants[0].iva || 0,
      quantity: getQuantity(product.variants[0]._id),
      index: 0,
    });
  }, [product]);

  const getQuantity = (variantId) => {
    const found = cart.find((item) => item.productId === variantId);
    return found ? found.quantity : 0;
  };

  return (
    <div key={product._id}>
      <h3>{product.name}</h3>
      <p>{selectedVariant.variantName}</p>
      <p>{selectedVariant.price}</p>

      {product.variants?.map((variant, index) => (
        <button
          key={variant._id}
          onClick={() => {
            const variantQty = getQuantity(variant._id);
            setSelectedVariant({
              ...variant,
              index,
              quantity: variantQty,
            });
          }}
        >
          {variant.abreviation}
        </button>
      ))}

      <div>
        <button
          disabled={selectedVariant.quantity === 0}
          onClick={() => {
            addToCart({ product, variant: selectedVariant, quantity: -1 });
            setSelectedVariant((prev) => ({
              ...prev,
              quantity: Math.max(0, prev.quantity - 1),
            }));
          }}
        >
          -
        </button>
        <p>{selectedVariant.quantity || 0}</p>
        <button
          onClick={() => {
            addToCart({ product, variant: selectedVariant, quantity: 1 });
            setSelectedVariant((prev) => ({
              ...prev,
              quantity: prev.quantity + 1,
            }));
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
