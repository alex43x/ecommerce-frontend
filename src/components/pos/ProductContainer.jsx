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

  useEffect(() => {
    const v = product.variants[selectedVariant.index] || product.variants[0];
    setSelectedVariant((prev) => ({
      ...v,
      index: prev.index,
      quantity: getQuantity(v._id),
    }));
  }, [cart, product]);

  return (
    <div className="bg-green-50 rounded-2xl p-4 shadow-2xl flex flex-col justify-between h-full">
      <div>
        <img
          className="w-full h-24 object-cover rounded-2xl"
          src={product.imageURL}
          alt={product.name}
        />
        <h3 className="text-xl font-medium mt-1">{product.name}</h3>
        <div className="flex justify-between mb-2 items-center font-medium">
          <p className="text-green-900">{selectedVariant.variantName}</p>
          <p>₲ {selectedVariant.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-3 gap-2 text-green-800 mb-2">
          {product.variants?.map((variant, index) => (
            <button
              className="bg-green-200 border border-green-900"
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
        </div>
        <div className="flex w-full justify-between rounded-xl px-2 py-1 bg-neutral-200 items-center">
          <div className="rounded-full bg-green-700 w-6 h-6 flex justify-center items-center">
            <button
              className="text-neutral-100"
              disabled={selectedVariant.quantity === 0}
              onClick={() => {
                addToCart({ product, variant: selectedVariant, quantity: -1 });
              }}
            >
              -
            </button>
          </div>
          <p className="font-medium">{selectedVariant.quantity || 0}</p>
          <div className="rounded-full bg-green-700 w-6 h-6 flex justify-center items-center">
            <button
              className="text-neutral-100"
              onClick={() => {
                addToCart({ product, variant: selectedVariant, quantity: 1 });
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
