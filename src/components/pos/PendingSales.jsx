import React, { useEffect, useState } from "react";
import { useSale } from "../../context/sale/SaleContext";
import ProductFormModal from "../dashboard/products/ProductFormModal";
import OrderDetail from "./OrderConfirm";

import pendiente from "../../images/pendiente-amarillo.png";
import cancelar from "../../images/error.png";
import listo from "../../images/listo.png";

export default function PendingSales() {
  const { getSales, sales, updateSaleStatus } = useSale();
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [order, setOrder] = useState();

  useEffect(() => {
    getSales({ page: 1, limit: 20, status: "pending" });
  }, []);

  const handleUpdate = async (saleId, newStatus) => {
    await updateSaleStatus(saleId, newStatus);
    getSales({ page: 1, limit: 20, status: "pending", forceRefresh: true });
  };

  return (
    <div>
      <h3 className="text-3xl font-medium mt-5 mb-3 text-green-800">Órdenes pendientes:</h3>
      <section className="grid grid-cols-2 gap-4">
        {sales && sales.length > 0 ? (
          sales.map((sale, index) => (
            <section
              key={sale._id}
              className="rounded-lg bg-neutral-50 p-3 shadow"
            >
              <div className="flex justify-between items-center mb-2 border-b-2 border-neutral-200 pb-2">
                <h3 className="font-medium text-lg">Orden #{index + 1}</h3>
                <div className="bg-yellow-100 rounded">
                  {sale.status === "pending" && (
                    <div className="flex gap-2 px-2 py-1">
                      <p className="text-yellow-900 font-medium">Pendiente</p>
                      <img
                        className="w-5 object-contain"
                        src={pendiente}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-1 rounded-lg h-40 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left  border-b-2 border-neutral-100">
                      <th className="pb-1 font-medium">Productos</th>
                      <th className="font-medium">Cant.</th>
                      <th className="flex justify-end font-medium">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.products?.flat().map((item, i) => (
                      <tr key={i} className="">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">
                          <div className="bg-green-200 rounded px-2 w-fit text-green-900">
                            x{item.quantity}
                          </div>
                        </td>
                        <td className="py-2 text-right">
                          ₲ {item.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between text-xl mt-1 font-medium border-t-2 border-neutral-200 pt-1">
                <p>Total</p>
                <p className="text-green-800">
                  ₲ {sale.totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 justify-evenly mt-2">
                <button
                  className="bg-green-200 rounded-lg text-green-800 px-2 py-1 flex gap-1 w-6/12 justify-evenly"
                  onClick={() => {
                    setOrder(sale), setConfirmOrder(true);
                  }}
                >
                  <p>Confirmar</p>
                  <img className="w-4 object-contain" src={listo} alt="" />
                </button>
                <button
                  className="bg-red-100 rounded-lg text-red-800 px-2 py-1 flex gap-1 justify-evenly w-5/12"
                  onClick={() => handleUpdate(sale._id, "canceled")}
                >
                  <p>Cancelar </p>
                  <img className="w-4 object-contain" src={cancelar} alt="" />
                </button>
              </div>
            </section>
          ))
        ) : (
          <p>No hay órdenes pendientes.</p>
        )}
      </section>

      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => {
          setConfirmOrder(false);
        }}
      >
        <OrderDetail onExit={() => setConfirmOrder(false)} saleData={order} />
      </ProductFormModal>
    </div>
  );
}
