import React, { useState } from "react";
import { SaleContext } from "./SaleContext";

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetched,setFetched]=useState(false)
  const token = localStorage.getItem("AuthToken");

  const getSales = async (page = 1, limit = 10, user = null) => {
    if (fetched) return;

    const queryparams = {
      page,
      limit,
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
      setFetched(true)
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

  const createSale = async (product) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: product,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
      value={{ sales, sale, loading, getSales, getSalesById,createSale,updateSale,deleteSale }}
    >
      {children}
    </SaleContext.Provider>
  );
};
