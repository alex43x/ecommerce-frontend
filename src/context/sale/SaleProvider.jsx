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
  limit = 20, // ← Número de resultados por página
  user = null,
  status = "pending",
  date = null,
  startDate = null,
  endDate = null,
  paymentMethod = null, // ✅ Nuevo filtro
  ruc = null,            // ✅ Nuevo filtro
  product = null,        // ✅ Nuevo filtro
  forceRefresh = false,
} = {}) => {
  if (fetched && !forceRefresh) return;

  setLoading(true);

  // Armamos los parámetros de la URL solo si tienen valor
  const queryParams = {
    page,
    limit,
    ...(user ? { user } : {}),
    ...(status && status !== "all" ? { status } : {}),
    ...(date ? { date } : {}),
    ...(startDate && endDate ? { startDate, endDate } : {}),
    ...(paymentMethod ? { paymentMethod } : {}), // ✅ Método de pago
    ...(ruc ? { ruc } : {}),                     // ✅ RUC del cliente
    ...(product ? { product } : {}),             // ✅ Nombre del producto
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

    // Guardamos las ventas y la paginación actual
    setSales(data.sales);
    setPage(data.currentPage);
    setTotalPages(data.totalPages);
    setFetched(true);
  } catch (e) {
    console.error("Error al obtener ventas:", e);
  } finally {
    setLoading(false);
  }
};


  const getSalesById = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/${id}`
      );
      const data = res.json();
      setSale(data);
    } catch (e) {
      console.error(e);
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
      console.log("Venta guardada:", data);
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
            Authorization: `Bearer ${token}`, // o el que uses
          },
          body: JSON.stringify({ status, ruc }),
        }
      );
      const data = await res.json();
      console.log("Venta actualizada:", data);
    } catch (error) {
      console.error("Error al actualizar venta:", error);
    }
  };

  const updateSale = async (product) => {
    //testear si agarra sin el parametro de id
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
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
      console.log(data);
    } catch (e) {
      console.error(e);
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
