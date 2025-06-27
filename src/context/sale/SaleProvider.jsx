import React, { useState } from "react";
import { SaleContext } from "./SaleContext";

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const token = localStorage.getItem("AuthToken");

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al obtener ventas");
      }

      setSales(data.sales);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setFetched(true);
    } catch (e) {
      console.error("Error al obtener ventas:", e);
      throw e;
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al obtener venta");
      }

      setSale(data);
    } catch (e) {
      console.error("Error al obtener venta por ID:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (sale) => {
    console.log(sale);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sale),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al guardar venta:", data);
        throw new Error(data.message || "Error al guardar venta");
      }

      console.log("Venta guardada:", data);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, ruc }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar estado de venta");
      }

      console.log("Venta actualizada:", data);
    } catch (error) {
      console.error("Error al actualizar venta:", error);
      throw error;
    }
  };

  const updateSale = async (id, newSale) => {
    setLoading(true);
    console.log(newSale);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newSale }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar producto");
      }
      console.log(data);
    } catch (e) {
      console.error("Error al actualizar producto:", e);
      throw e;
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar venta");
      }

      console.log(data);
    } catch (e) {
      console.error("Error al eliminar venta:", e);
      throw e;
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
        setPage,
        totalPages,
        setTotalPages,
        loading,
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
