import React, { useState } from "react";
import { SaleContext } from "./SaleContext";
export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const token = localStorage.getItem("AuthToken");

  const getSales = async (
    page = 1,
    limit = 10,
    user = null,
    forceRefresh = false
  ) => {
    if (fetched && !forceRefresh) return;
    setLoading(true);
    const queryparams = {
      page,
      limit,
      status: "pending",
      ...(user && { user }),
    };

    const params = new URLSearchParams(queryparams);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data.sales);
      setSales(data.sales);
      setPage(data.page);
      setFetched(true);
    } catch (e) {
      console.error(e);
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

  const updateSaleStatus = async (saleId, status,ruc) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sales/${saleId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // o el que uses
          },
          body: JSON.stringify({ status,ruc }),
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
