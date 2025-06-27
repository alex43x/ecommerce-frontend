import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/cart/CartContext";

export default function ProductContainer({ product }) {
  const { cart, addToCart } = useCart();
  const intervalRef = useRef(null);
  const activeVariantIdRef = useRef(null);
  const lastQuantityRef = useRef(0);

  const getQuantity = (variantId) => {
    const found = cart.find((item) => item.variantId === variantId);
    return found ? found.quantity : 0;
  };

  const [selectedVariant, setSelectedVariant] = useState(() => {
    const v = product.variants[0];
    const qty = getQuantity(v._id);
    lastQuantityRef.current = qty;
    activeVariantIdRef.current = v._id;

    return {
      ...v,
      quantity: qty,
      index: 0,
    };
  });

  useEffect(() => {
    const v = product.variants[selectedVariant.index] || product.variants[0];
    const qty = getQuantity(v._id);
    lastQuantityRef.current = qty;
    activeVariantIdRef.current = v._id;

    setSelectedVariant((prev) => ({
      ...v,
      index: prev.index,
      quantity: qty,
    }));
  }, [cart, product]);

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) value = 0;

    const current = getQuantity(selectedVariant._id);
    const diff = value - current;
    if (diff !== 0) {
      addToCart({ product, variant: selectedVariant, quantity: diff });
    }
  };

  const stopHold = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleHold = (change) => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const qty = lastQuantityRef.current;

      if (change < 0 && qty <= 0) {
        stopHold();
        return;
      }

      const variant = product.variants.find(
        (v) => v._id === activeVariantIdRef.current
      );
      if (!variant) return;

      addToCart({
        product,
        variant: { ...variant, index: selectedVariant.index },
        quantity: change,
      });

      lastQuantityRef.current = qty + change; // actualizar manualmente
    }, 150);
  };

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
          <p>
            {selectedVariant.price.toLocaleString("es-PY", {
              style: "currency",
              currency: "PYG",
            })}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-3 gap-2 text-green-800 mb-2">
          {product.variants?.map((variant, index) => (
            <button
              className={` active:bg-green-300 transition border border-green-900 ${
                selectedVariant._id == variant._id
                  ? "bg-green-300"
                  : "bg-green-100"
              }`}
              key={variant._id}
              onClick={() => {
                const variantQty = getQuantity(variant._id);
                setSelectedVariant({
                  ...variant,
                  index,
                  quantity: variantQty,
                });
                activeVariantIdRef.current = variant._id;
                lastQuantityRef.current = variantQty;
              }}
            >
              {variant.abreviation}
            </button>
          ))}
        </div>

        <div className="flex w-full justify-between rounded-xl px-2 py-1 bg-neutral-200 items-center">
          <div
            className="rounded-lg bg-green-700 hover:bg-green-600 active:bg-green-500 transition w-10 h-8 text-2xl flex justify-center items-center"
            onMouseDown={() => handleHold(-1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => handleHold(-1)}
            onTouchEnd={stopHold}
          >
            <button
              className="text-neutral-100"
              onClick={() => {
                if (selectedVariant.quantity > 0) {
                  addToCart({
                    product,
                    variant: selectedVariant,
                    quantity: -1,
                  });
                  lastQuantityRef.current = selectedVariant.quantity - 1;
                }
              }}
            >
              -
            </button>
          </div>

          <input
            className="font-medium bg-neutral-200 w-16 px-1 text-center text-lg"
            type="number"
            min={0}
            value={selectedVariant.quantity || 0}
            onChange={handleQuantityChange}
          />

          <div
            className="rounded-lg bg-green-700 hover:bg-green-600 active:bg-green-500 transition w-10 h-8 text-2xl flex justify-center items-center"
            onMouseDown={() => handleHold(1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => handleHold(1)}
            onTouchEnd={stopHold}
          >
            <button
              className="text-neutral-100"
              onClick={() => {
                addToCart({
                  product,
                  variant: selectedVariant,
                  quantity: 1,
                });
                lastQuantityRef.current = selectedVariant.quantity + 1;
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
