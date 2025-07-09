// SaleProvider.jsx
import React, { useState } from "react";
import { SaleContext } from "./SaleContext";
import { useAuth } from "../auth/AuthContext";

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);

  const { logout } = useAuth();

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
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
      ...(product ? { product } : {}),
    };

    const params = new URLSearchParams(queryParams);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
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
          headers: getAuthHeaders(),
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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(sale),
      });

      handleUnauthorized(res);
      const data = await res.json();

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
          headers: getAuthHeaders(),
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
          headers: getAuthHeaders(),
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
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};
