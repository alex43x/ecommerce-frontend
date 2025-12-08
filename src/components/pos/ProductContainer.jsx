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
    <div className="bg-green-50 rounded-2xl p-2 shadow-2xl flex flex-col justify-between h-full">
      <div className="flex gap-2 max-h-[4.5rem]">
        <img
          className="w-5/12 h-[4.5rem] object-cover rounded-2xl"
          src={product.imageURL}
          alt={product.name}
        />
        <h3 className="mt-1 w-7/12 text-[1.05rem] font-medium break-words ">
          {product.name}
        </h3>
      </div>
      <div className="flex justify-between my-1 items-center font-medium">
        <p className="text-green-900">{selectedVariant.variantName}</p>
        <p>
          {selectedVariant.price.toLocaleString("es-PY", {
            style: "currency",
            currency: "PYG",
          })}
        </p>
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-4 gap-1.5 text-green-800 mb-2">
          {product.variants?.map((variant, index) => (
            <button
              className={`text-sm px-0 active:bg-green-300 transition border border-green-900 ${
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
              {variant.abreviation?.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="flex w-full justify-between rounded-xl px-2 py-1 bg-neutral-200 items-center">
          <button
            className="rounded-lg bg-green-700 hover:bg-green-600 active:bg-green-500 transition w-10 h-8 text-2xl flex justify-center items-center text-neutral-100 "
            onMouseDown={() => handleHold(-1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => handleHold(-1)}
            onTouchEnd={stopHold}
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

          <input
            className="font-medium bg-neutral-200 w-16 px-1 text-center text-lg"
            type="number"
            min={0}
            value={selectedVariant.quantity || 0}
            onChange={handleQuantityChange}
          />

          <button
            className="rounded-lg bg-green-700 hover:bg-green-600 active:bg-green-500 transition w-10 h-8 text-2xl flex justify-center items-center text-neutral-100"
            onMouseDown={() => handleHold(1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => handleHold(1)}
            onTouchEnd={stopHold}
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
  );
}
