import React, { useEffect, useState } from "react";
import { useSale } from "../../context/sale/SaleContext";
import ProductFormModal from "../dashboard/products/ProductFormModal";
import OrderDetail from "./OrderConfirm";

import Swal from "sweetalert2";
import pendiente from "../../images/pendiente-amarillo.png";
import cancelar from "../../images/error.png";
import terminado from "../../images/terminado.png";
import listo from "../../images/listo.png";
import marcarListo from "../../images/restaurante.png";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "completed", label: "Completados" },
  { value: "pending", label: "Reservados" },
  { value: "ordered", label: "Pedidos" },
  { value: "canceled", label: "Cancelados" },
];

export default function PendingSales() {
  const { getSales, sales, updateSaleStatus, page, setPage, totalPages } =
    useSale();
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [order, setOrder] = useState();
  const [selectedStatus, setSelectedStatus] = useState("all");

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Asuncion",
  });

  useEffect(() => {
    setPage(1); // solo cuando cambia el filtro
  }, [selectedStatus]);

  useEffect(() => {
    getSales({
      page,
      limit: 14,
      status: selectedStatus,
      startDate: today,
      endDate: today,
      forceRefresh: true,
    });
  }, [page, selectedStatus]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCancel = async (saleId) => {
    const result = await Swal.fire({
      title: "¿Cancelar venta?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await updateSaleStatus(saleId, "canceled");
      getSales({
        page: page,
        limit: 20,
        status: selectedStatus,
        forceRefresh: true,
        startDate: today,
        endDate: today,
      });
      Swal.fire({
        title: "Cancelado",
        text: "La venta ha sido cancelada.",
        icon: "success",
        confirmButtonColor: "#057c37",
      });
    }
  };

  return (
    <div>
      <h3 className="text-3xl  mt-5 mb-3 text-green-800">Órdenes del día</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedStatus(value)}
            className={`px-3 py-2 rounded-lg border ${
              selectedStatus === value
                ? "bg-green-300 text-green-800"
                : "bg-green-100 text-green-800 border-green-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-4">
        {sales && sales.length > 0 ? (
          sales.map((sale) => (
            <section
              key={sale._id}
              className="rounded-lg bg-neutral-50 p-3 shadow"
            >
              <div className="flex justify-between items-center mb-2 border-b-2 border-neutral-200 pb-2">
                <h3 className="font-medium text-lg">
                  Orden #{sale._id.slice(-3).toUpperCase()}
                </h3>
                {/* Mostrar stage con imagen */}
                {sale.stage === "delivered" && (
                  <div className="bg-green-100 rounded-lg flex gap-2 px-2 py-1 border border-green-800 hover:bg-green-200 trasnsition">
                    <p className="text-green-800 font-medium">Entregado</p>
                    <img className="w-5 object-contain" src={listo} alt="" />
                  </div>
                )}
                {sale.stage === "finished" && (
                  <div className="bg-lime-100 rounded-lg flex gap-2 px-2 py-1 border border-lime-700">
                    <p className="text-lime-800 font-medium">Terminado</p>
                    <img
                      className="w-5 object-contain"
                      src={terminado}
                      alt=""
                    />
                  </div>
                )}
                {sale.stage === "processed" && (
                  <div className="bg-yellow-100 rounded-lg flex gap-2 px-2 py-1 border items-center border-yellow-800">
                    <p className="text-yellow-900 font-medium">En proceso</p>
                    <img
                      className="w-5 h-5 object-contain"
                      src={pendiente}
                      alt=""
                    />
                  </div>
                )}
                {sale.stage === "closed" && (
                  <div className="bg-red-100 rounded-lg flex gap-2 px-2 py-1 border border-red-800">
                    <p className="text-red-800 font-medium">Cancelado</p>
                    <img className="w-5 object-contain" src={cancelar} alt="" />
                  </div>
                )}
              </div>

              <div className="p-1 rounded-lg h-40 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b-2 border-neutral-100">
                      <th className=" font-medium">Productos</th>
                      <th className="font-medium">Cant.</th>
                      <th className="flex justify-end font-medium">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.products?.flat().map((item, i) => (
                      <tr key={i}>
                        <td className="py-2 w-[50%] pr-2 font-medium">
                          {item.name}
                        </td>
                        <td className="py-2 pr-1">
                          <div className="bg-green-200 rounded-md px-2 w-fit text-green-800 font-medium">
                            x{item.quantity}
                          </div>
                        </td>
                        <td className="py-2 text-right font-medium">
                          {item.totalPrice.toLocaleString("es-PY", {
                            style: "currency",
                            currency: "PYG",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between text-xl mt-1 font-medium border-t-2 border-neutral-200 pt-1">
                <p>Total</p>
                <p className="text-green-800">
                  {sale.totalAmount.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </p>
              </div>

              {/* Mostrar botones solo si el estado es "pending" u "ordered" */}
              {["pending", "ordered"].includes(sale.status) && (
                <div className="flex gap-2 justify-evenly mt-2">
                  <button
                    className="bg-green-200 rounded-lg text-green-800 px-3 py-1 flex gap-1 w-fit justify-center border border-green-800"
                    onClick={() => {
                      setOrder(sale);
                      setConfirmOrder(true);
                    }}
                  >
                    <p>Pagar</p>
                    <img className="w-4 object-contain" src={listo} alt="" />
                  </button>
                  <button
                    className="bg-red-100 rounded-lg text-red-800 px-2 py-1 flex gap-1 justify-evenly w-5/12 border border-red-800"
                    onClick={() => handleCancel(sale._id)}
                  >
                    <p>Cancelar</p>
                  </button>
                  {sale.stage !== "finished" && (
                    <button
                      className="bg-neutral-200 rounded-lg text-neutral-800 px-2 py-1 flex gap-1 justify-center w-4/12 items-center border border-neutral-800"
                      onClick={async () => {
                        await updateSaleStatus(sale._id, "ready");

                        getSales({
                          page: 1,
                          limit: 20,
                          status: selectedStatus,
                          forceRefresh: true,
                          startDate: today,
                          endDate: today,
                        });
                        Swal.fire({
                          title: "Listo",
                          text: "El estado ha sido cambiado a Ready",
                          icon: "success",
                        });
                      }}
                    >
                      <p>Listo</p>
                      <img
                        className="w-4 h-4 object-contain"
                        src={marcarListo}
                        alt=""
                      />
                    </button>
                  )}
                </div>
              )}
            </section>
          ))
        ) : (
          <p>No hay órdenes con este estado.</p>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => {
          setConfirmOrder(false);
        }}
      >
        <OrderDetail
          onExit={() => setConfirmOrder(false)}
          saleData={order}
          paymentMode="complete"
        />
      </ProductFormModal>
    </div>
  );
}
