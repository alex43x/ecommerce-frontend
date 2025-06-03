import React, { useState } from "react";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { useSale } from "../../context/sale/SaleContext";
import cerrar from "../../images/eliminar.png";
import listo from "../../images/listo.png";
import guardar from "../../images/guardar.png";
import borrar from "../../images/borrar.png";

import cash from "../../images/cash.png";
import card from "../../images/card.png";
import qr from "../../images/qr.png";
import Swal from "sweetalert2";

export default function OrderDetail({ onExit = () => {}, saleData = null }) {
  const { cart, setCart, totalAmount, paymentMethod, setPaymentMethod } =
    useCart();
  const { user } = useAuth();
  const { createSale, updateSaleStatus, getSales } = useSale();
  const [ruc, setRuc] = useState(saleData?.ruc || "");
  const [received, setReceived] = useState(0);

  const items = saleData?.products || cart;
  const total = saleData?.totalAmount || totalAmount;


  const vuelto = received - total;

  const handleSave = async () => {
    if (!ruc.trim()) {
      return Swal.fire(
        "Campo requerido",
        "Por favor ingresa un RUC",
        "warning"
      );
    }

    try {
      if (saleData) {
        await updateSaleStatus(saleData._id, "completed", ruc);
      } else {
        const sale = {
          products: cart,
          totalAmount,
          ruc,
          paymentMethod,
          iva: Math.ceil(totalAmount / 11),
          user: user.id,
          status: "completed",
        };
        await createSale(sale);
        setCart([]);
      }
      Swal.fire(
        "Venta completada",
        "La venta fue registrada con éxito",
        "success"
      );
      onExit();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Hubo un problema al registrar la venta", "error");
    }
  };

  const handleKeyPress = (num) => {
    setReceived((prev) => parseInt(`${prev}${num}`));
  };

  const handleClear = () => {
    setReceived((prev) => Math.floor(prev / 10));
  };

  const handleSavePendingSale = async () => {
    const provisionalSale = {
      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        iva: item.iva,
        totalPrice: item.totalPrice,
        name: item.name,
      })),
      totalAmount,
      ruc: "Sin RUC",
      paymentMethod,
      iva: (totalAmount / 11).toFixed(),
      user: user.id,
      status: "pending",
    };

    try {
      await createSale(provisionalSale);
      await getSales({ page: 1, limit: 20, forceRefresh: true });
      Swal.fire("Guardado", "Venta guardada como pendiente", "success");
    } catch (e) {
      console.error("Error al guardar venta pendiente:", e);
      Swal.fire("Error", "No se pudo guardar la venta pendiente", "error");
    }
  };

  return (
    <div className="w-[650px]">
      <div className="flex justify-between mb-3">
        <h3 className="text-2xl font-bold ml-1 text-green-900">
          Pago de Orden
        </h3>
        <img
          className="w-5 object-contain"
          src={cerrar}
          alt=""
          onClick={onExit}
        />
      </div>
      <div className="flex">
        <section className="w-1/2 pr-1">
          <div className="p-2 bg-[#dae4e4] rounded-lg h-40 max-h-40 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-neutral-100">
                  <th className="pb-1">Productos</th>
                  <th>Cant.</th>
                  <th className="flex justify-end">Precio</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="font-medium">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">
                      <div className="bg-green-200 rounded px-2 w-fit text-green-900">
                        x{item.quantity}
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      ₲ {(item.totalPrice || item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="font-medium mt-4 p-2 bg-[#dae4e4] rounded-lg">
            <div className="flex justify-between w-full my-1">
              <p>Subtotal:</p>
              <p className="text-green-900">₲ {(total / 1.1).toFixed()}</p>
            </div>
            <div className="flex justify-between my-1">
              <p>IVA 10%</p>
              <p className="text-green-900">₲ {(total / 11).toFixed()}</p>
            </div>
            <div className="flex justify-between text-xl py-1 mt-1 border-t-2 border-dashed border-neutral-50">
              <p>Total</p>
              <p className="text-green-900">₲ {total.toLocaleString()}</p>
            </div>
            <div className="flex justify-between  py-1 border-t-2 border-dashed  border-neutral-50">
              <p>Vuelto</p>
              <p className="text-green-900">
                ₲ {vuelto > 0 ? vuelto.toLocaleString() : 0}
              </p>
            </div>
          </div>
        </section>

        <section className="w-1/2 pl-2">
          <div className="flex items-center gap-2">
            <label className="font-medium">RUC: </label>
            <input
              required
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              type="text"
              className="px-2 py-1 w-full "
            />
          </div>

          <div>
            <div className="flex justify-center  p-2  mb-2 text-xl text-right font-medium">
              ₲ {received.toLocaleString()}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2 px-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="bg-green-100 active:bg-green-200 transition text-xl rounded text-green-800"
                >
                  {num}
                </button>
              ))}
              <div></div> {/* Espacio vacío a la izquierda */}
              <button
                onClick={() => handleKeyPress(0)}
                className="bg-green-100 active:bg-green-200 transition text-xl rounded  text-green-800"
              >
                0
              </button>
              <button
                onClick={handleClear}
                className="bg-red-100  p-2 rounded text-red-800 flex justify-center"
              >
                <img className="w-5 object-contain" src={borrar} alt="Borrar" />
              </button>
            </div>
          </div>
          <section className="flex bg-neutral-200 rounded-lg my-3">
            {[
              { value: "cash", label: "Efectivo", icon: cash },
              { value: "card", label: "Tarjeta", icon: card },
              { value: "qr", label: "QR", icon: qr },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                className={`w-1/3 flex items-center justify-center gap-1 p-1 rounded-lg ${
                  paymentMethod === value
                    ? "bg-green-200 border border-green-800 text-green-800"
                    : ""
                }`}
                type="button"
                value={value}
                onClick={() => setPaymentMethod(value)}
              >
                <p>{label}</p>
                <img className="w-4 object-contain" src={icon} alt="" />
              </button>
            ))}
          </section>
          <section className="flex gap-2 justify-evenly mt-3">
            <button
              className="bg-green-200 border border-green-800 rounded-lg text-green-800 flex gap-1 px-2 py-1 w-4/12 justify-evenly"
              type="button"
              onClick={handleSave}
            >
              <p>Finalizar</p>
              <img className="w-4 object-contain" src={listo} alt="" />
            </button>
            <button
              disabled={!paymentMethod || cart.length === 0}
              className="bg-neutral-100 border border-neutral-800 rounded-lg flex gap-1 px-2 py-1 w-8/12 justify-evenly"
              type="button"
              onClick={() => {
                handleSavePendingSale();
                setCart([]);
                onExit();
              }}
            >
              <p>Guardar Pendiente</p>
              <img className="w-4 object-contain" src={guardar} alt="" />
            </button>
          </section>
        </section>
      </div>
    </div>
  );
}
