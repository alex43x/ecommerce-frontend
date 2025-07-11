import React, { useEffect, useState } from "react";
import { useSale } from "../../context/sale/SaleContext";
import { useUser } from "../../context/user/UserContext";
import RecentSales from "../../components/dashboard/sales/SalesTable";
import cancelado from "../../images/eliminar.png";
import listo from "../../images/listo.png";
import todo from "../../images/todo.png";
import pendiente from "../../images/pendiente.png";
import Dropdown from "../../components/dashboard/products/FilterDropdown";

export default function Sales() {
  const { getSales, sales, loading, page, totalPages, updateSaleStatus } =
    useSale();
  const { users, getUsers } = useUser();

  const [status, setStatus] = useState("all");
  const [user, setUser] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ruc, setRuc] = useState("");
  const [product, setProduct] = useState("");
  const [debouncedProduct, setDebouncedProduct] = useState("");
  const [debouncedRUC, setDebouncedRUC] = useState("");

  const startDefault = new Date();
  startDefault.setDate(startDefault.getDate() - 7);
  const endDefault = new Date(Date.now());
  endDefault.setDate(endDefault.getDate());
  const formatDate = (date) => date.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(formatDate(startDefault));
  const [endDate, setEndDate] = useState(formatDate(endDefault));

  const paymentOptions = [
    { label: "Todos", value: "" },
    { label: "Efectivo", value: "cash" },
    { label: "Tarjeta", value: "card" },
    { label: "QR", value: "qr" },
    { label: "Transferencia", value: "transfer" },
  ];
  const userOptions = [
    { label: "Todos", value: "" },
    ...users.map((user) => ({
      label: user.name,
      value: user._id,
    })),
  ];

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedProduct(product);
    }, 500);
    return () => clearTimeout(timeout);
  }, [product]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedRUC(ruc);
    }, 500);
    return () => clearTimeout(timeout);
  }, [ruc]);

  useEffect(() => {
    getSales({
      page,
      limit: 30,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      user: user || null,
      paymentMethod: paymentMethod || null,
      ruc: debouncedRUC || null,
      product: debouncedProduct || null,
      forceRefresh: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    startDate,
    endDate,
    user,
    paymentMethod,
    debouncedRUC,
    debouncedProduct,
    page,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    getSales({
      page: newPage,
      limit: 10,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      user: user || null,
      paymentMethod: paymentMethod || null,
      ruc: ruc || null,
      product: debouncedProduct || null,
      forceRefresh: true,
    });
  };

  const tabClasses = (tab) =>
    `px-4 py-2 rounded-md  transition-colors flex items-center justify-center gap-1 border border-green-800 text-green-800 ${
      status === tab ? "bg-green-300 " : "bg-green-100 hover:bg-green-200  "
    }`;

  const statusMap = {
    all: { label: "Todos", icon: todo },
    completed: { label: "Completado", icon: listo },
    ordered: { label: "Pedido", icon: pendiente },
    pending: { label: "Pendiente", icon: pendiente },
    canceled: { label: "Cancelado", icon: cancelado },
    annulled: { label: "Anulado", icon: cancelado },
  };

  return (
    <div>
      {/* Filtros por estado */}
      <section className="flex flex-wrap gap-2 mb-4 ">
        {Object.entries(statusMap).map(([key, { label, icon }]) => (
          <button
            className={tabClasses(key)}
            key={key}
            onClick={() => setStatus(key)}
          >
            <img src={icon} alt={label} className="w-4 h-4" />

            {label}
          </button>
        ))}
      </section>

      {/* Filtros adicionales */}
      <section className="flex flex-wrap gap-3  my-2">
        <div>
          <label className="text-green-800">RUC: </label>
          <input
            type="text"
            value={ruc}
            className="border px-2 py-1 rounded-lg"
            placeholder="RUC del cliente"
            onChange={(e) => setRuc(e.target.value)}
          />
        </div>
        <div className="">
          <label className="text-green-800">Producto: </label>
          <input
            type="text"
            value={product}
            placeholder="Nombre del Producto"
            className="border px-2 py-1 rounded-lg"
            onChange={(e) => setProduct(e.target.value)}
          />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <label className="text-green-800">Vendedor: </label>
          <Dropdown
            items={userOptions}
            selected={userOptions.find((opt) => opt.value === user)}
            onSelect={(option) => setUser(option.value)}
            placeholder="Por Vendedor"
          />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <label className="text-green-800">Método de Pago: </label>
          <Dropdown
            items={paymentOptions}
            selected={paymentOptions.find((opt) => opt.value === paymentMethod)}
            onSelect={(option) => setPaymentMethod(option.value)}
            placeholder="Por Método de Pago"
          />
        </div>

        <div className=" flex flex-wrap items-center gap-2">
          <label className="text-green-800">Desde: </label>
          <input
            type="date"
            className="px-2 py-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="text-green-800">Hasta: </label>
          <input
            type="date"
            className="px-2 py-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </section>

      {/* Tabla de ventas */}
      <section className="mt-4">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <RecentSales
            sales={sales}
            onCancel={(saleId) => {
              updateSaleStatus(saleId, "annulled");
              getSales({
                page,
                limit: 30,
                status,
                startDate: startDate || null,
                endDate: endDate || null,
                user: user || null,
                paymentMethod: paymentMethod || null,
                ruc: debouncedRUC || null,
                product: debouncedProduct || null,
                forceRefresh: true,
              });
            }}
          />
        )}
      </section>

      {/* Paginación */}

      <section className="flex items-center justify-center gap-4 mt-6">
        <button
          className="bg-green-200 border border-green-800 text-green-800 px-2 py-1"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          ← Anterior
        </button>
        <p className="text-green-800 font-medium">
          Página {page} de {totalPages}
        </p>
        <button
          className="bg-green-200 border border-green-800 text-green-800 px-2 py-1"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente →
        </button>
      </section>
    </div>
  );
}
