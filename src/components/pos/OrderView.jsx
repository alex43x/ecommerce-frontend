import React, { useState } from "react";
import { useCart } from "../../context/cart/CartContext";

import ProductFormModal from "../dashboard/products/ProductFormModal";
import OrderDetail from "./OrderConfirm";

import vaciar from "../../images/vaciar.png";
import carrito from "../../images/carrito.png";

export default function OrderView() {
  const { cart, setCart, totalAmount, removeFromCart, paymentMethod,setPaymentMethod } =
    useCart();
  const [saleMode, setSaleMode] = useState("local");
  const [confirmOrder, setConfirmOrder] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Parte superior */}
      <div className="flex flex-col gap-2 flex-grow overflow-hidden">
        <h1 className="mt-4 text-green-900 font-medium">Nueva Orden</h1>

        {/* Modo de venta */}
        <section className="flex  bg-neutral-200 rounded-lg my-3 justify-evenly">
          {["local", "carry", "delivery"].map((mode) => (
            <button
              key={mode}
              className={
                saleMode === mode
                  ? "bg-green-200 border border-green-800 text-green-800 rounded-lg py-1 px-2 "
                  : ""
              }
              type="button"
              value={mode}
              onClick={(e) => setSaleMode(e.target.value)}
            >
              {mode === "local"
                ? "En Local"
                : mode === "carry"
                ? "Para Llevar"
                : "Delivery"}
            </button>
          ))}
        </section>

        <div className="flex justify-between items-center pr-3">
          <h3 className="font-medium text-lg text-green-800">
            Productos Seleccionados:
          </h3>
          <img
            className="w-5 h-5 object-contain"
            src={vaciar}
            alt="vaciar"
            onClick={() => {
              setCart([]);
            }}
          />
        </div>

        {/* Carrito */}
        <section className="flex-grow overflow-y-auto  p-2 rounded-lg border border-green-800">
          {cart.length === 0 ? (
            <div className="flex items-center h-full px-4">
              <p className="text-center text-neutral-500 block font-medium text-lg">
                No hay productos en el carrito.
              </p>
              <img className="w-6/12 block" src={carrito} alt="carrito" />
            </div>
          ) : (
            cart.map((item) => (
              <section
                className="border border-green-700 rounded-lg p-1.5 mb-2 bg-neutral-50"
                key={item.variantId}
              >
                <div className="flex justify-between font-medium">
                  <div className="w-7/12 flex flex-wrap justify-between text-green-900">
                    <p>{item.name}</p>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <div className="rounded w-fit h-fit px-1 bg-green-200 text-green-800 ">
                        <p>x{item.quantity}</p>
                      </div>
                      <p className="text-green-700">
                        {item.totalPrice.toLocaleString("es-PY", {
                          style: "currency",
                          currency: "PYG",
                        })}
                      </p>
                    </div>
                    <button
                      className="bg-green-200 text-green-800 h-6 w-5 text-sm flex justify-center ml-auto items-center  border border-green-800"
                      onClick={() => removeFromCart(item.variantId)}
                    >
                      x
                    </button>
                  </div>
                </div>
              </section>
            ))
          )}
        </section>
      </div>

      {/* Parte inferior */}
      <div className="space-y-2 py-2">
        <section className="bg-[#dae4e4] p-2 font-medium rounded-lg">
          <div className="flex justify-between">
            <p>Subtotal: </p>
            <p className="text-green-900">
              {" "}
              {(totalAmount / 1.1).toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })}
            </p>
          </div>
          <div className="flex justify-between">
            <p>IVA 10%</p>
            <p className="text-green-900">
              {(totalAmount / 11).toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })}
            </p>
          </div>
          <div className="flex justify-between text-xl py-1 mt-1 border-t-2 border-dashed">
            <p>Total</p>
            <p className="text-green-900">
              {Number(totalAmount).toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })}
            </p>
          </div>
        </section>

        <section className="flex justify-evenly">
          <button
            disabled={!paymentMethod || cart.length === 0 || !saleMode}
            className="bg-green-200 border border-green-800 rounded-lg text-green-800 flex gap-2 px-2 py-1 w-full justify-evenly"
            type="button"
            onClick={() => {
              setConfirmOrder(true);
            }}
          >
            <p className="text-2xl">Terminar Venta</p>
          </button>
        </section>
      </div>
      {/* Modal */}
      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => {setConfirmOrder(false),setPaymentMethod("cash")}}
      >
        <OrderDetail onExit={() => setConfirmOrder(false)} mode={saleMode} paymentMode="first"/>
      </ProductFormModal>
    </div>
  );
}
