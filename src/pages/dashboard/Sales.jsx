import React, { useEffect, useState } from "react";
import { useSale } from "../../context/sale/SaleContext";
import { useUser } from "../../context/user/UserContext";
import RecentSales from "../../components/dashboard/sales/SalesTable";

export default function Sales() {
  const { getSales, sales, loading, page, totalPages } = useSale();
  const { users, getUsers } = useUser();

  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ruc, setRuc] = useState("");
  const [product, setProduct] = useState("");
  const [debouncedProduct, setDebouncedProduct] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  // Debouncing para el input de producto
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedProduct(product);
    }, 500);
    return () => clearTimeout(timeout);
  }, [product]);

  // Llama al backend cuando cambian los filtros
  useEffect(() => {
    getSales({
      page,
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
  }, [
    status,
    startDate,
    endDate,
    user,
    paymentMethod,
    ruc,
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

  return (
    <div>
      {/* Filtros por estado */}
      <section className="flex gap-2 mb-4">
        {["all", "completed", "pending", "canceled"].map((s) => (
          <button key={s} onClick={() => setStatus(s)}>
            {s === "all" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </section>

      {/* Filtros adicionales */}
      <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label>Desde:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>Hasta:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Usuario:</label>
          <select value={user} onChange={(e) => setUser(e.target.value)}>
            <option value="">Todos</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Método de pago:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="card">Tarjeta</option>
            <option value="qr">QR</option>
            <option value="cash">Efectivo</option>
          </select>
        </div>
        <div>
          <label>RUC:</label>
          <input
            type="text"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
          />
        </div>
        <div>
          <label>Producto:</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
        </div>
      </section>

      {/* Tabla de ventas */}
      <section>
        {loading ? <p>Cargando...</p> : <RecentSales sales={sales} />}
      </section>

      {/* Paginación */}
      <section className="flex items-center gap-4 mt-6">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          ← Anterior
        </button>
        <p>
          Página {page} de {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente →
        </button>
      </section>
    </div>
  );
}
