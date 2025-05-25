import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cart/CartContext";

export default function ProductContainer({ product }) {
  const { cart, addToCart } = useCart();

  const getQuantity = (variantId) => {
    const found = cart.find((item) => item.variantId === variantId);
    return found ? found.quantity : 0;
  };

  const [selectedVariant, setSelectedVariant] = useState(() => {
    const v = product.variants[0];
    return {
      _id: v._id,
      variantName: v.variantName || "",
      price: v.price || 0,
      iva: v.iva || 0,
      quantity: getQuantity(v._id),
      index: 0,
    };
  });

  // ✅ Actualiza cantidad desde cart cada vez que cambian cart o product
  useEffect(() => {
    const v = product.variants[selectedVariant.index] || product.variants[0];
    setSelectedVariant((prev) => ({
      ...v,
      index: prev.index,
      quantity: getQuantity(v._id),
    }));
  }, [cart, product]);

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
          }}
        >
          -
        </button>
        <p>{selectedVariant.quantity || 0}</p>
        <button
          onClick={() => {
            addToCart({ product, variant: selectedVariant, quantity: 1 });
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
