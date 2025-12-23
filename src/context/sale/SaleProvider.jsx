// SaleProvider.jsx
import React, { useState } from "react";
import { SaleContext } from "./SaleContext";
import { useAuth } from "../auth/AuthContext";

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const { logout } = useAuth();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
  });

  const handleUnauthorized = (res) => {
    if (res.status === 401) {
      logout();
      throw new Error("Token inválido o expirado");
    }
  };

  const getSales = async ({
    page = 1,
    limit = 20,
    user = null,
    status = "all",
    date = null,
    startDate = null,
    endDate = null,
    dailyId = null,
    paymentMethod = null,
    ruc = null,
    product = null,
    forceRefresh = false,
  } = {}) => {
    if (fetched && !forceRefresh) return;

    setLoading(true);

    const queryParams = {
      page,
      limit,
      ...(user ? { user } : {}),
      ...(status && status !== "all" ? { status } : {}),
      ...(date ? { date } : {}),
      ...(startDate && endDate ? { startDate, endDate } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(ruc ? { ruc } : {}),
      ...(dailyId ? { dailyId } : {}),
      ...(product ? { product } : {}),
    };

    const params = new URLSearchParams(queryParams);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales?${params.toString()}`,
        {
          method: "GET",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        }
      );

      handleUnauthorized(res);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al obtener ventas");

      setSales(data.data);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const getSalesById = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/${id}`,
        {
          method: "GET",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        }
      );

      handleUnauthorized(res);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al obtener venta");
      setSale(data);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (sale) => {
    setLoading(true);
    console.log(sale)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(sale),
      });

      handleUnauthorized(res);
      const data = await res.json();

      console.log(data);
      if (!res.ok) throw new Error(data.message || "Error al guardar venta");
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateSaleStatus = async (saleId, status, ruc) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/${saleId}/status`,
        {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ status, ruc }),
        }
      );

      handleUnauthorized(res);
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Error al actualizar estado de venta");
    } finally {
      setLoading(false);
    }
  };

  const updateSale = async (id, newSale) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/${id}`,
        {
          method: "PUT",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(newSale),
        }
      );

      handleUnauthorized(res);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al actualizar venta");
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      handleUnauthorized(res);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al eliminar venta");
    } finally {
      setLoading(false);
    }
  };

  const exportSalesToExcel = async (filters = {}) => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
      )
    );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/export/?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      handleUnauthorized(res);

      if (!res.ok) throw new Error("Error al exportar Excel");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const filename =
        filters.startDate && filters.endDate
          ? `ventas_${filters.startDate}_${filters.endDate}.xlsx`
          : "ventas.xlsx";

      a.download = filename;
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exportando Excel:", err);
    }
  };

  return (
    <SaleContext.Provider
      value={{
        sales,
        sale,
        page,
        totalPages,
        loading,
        setPage,
        setTotalPages,
        getSales,
        getSalesById,
        createSale,
        updateSale,
        updateSaleStatus,
        deleteSale,
        exportSalesToExcel,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};
