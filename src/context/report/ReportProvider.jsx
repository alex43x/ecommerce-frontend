import React, { useState } from "react";
import { ReportContext } from "./ReportContext";

export const ReportProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [payment, setPayment] = useState(null);
  const [category, setCategory] = useState(null);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const token = localStorage.getItem("AuthToken");

  // Helper function to fetch data
  const fetchReport = async (url, setData, key, force = false) => {
    if (!force && fetched) return;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      setData(data);
      setFetched(true);
    } catch (error) {
      console.error("Error al cargar reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Reporte resumen de día, semana, mes
  const getSummaryReport = async (force = false) => {
    fetchReport("/api/reports/totals", setSummary, "summary", force);
  };

  // 🔸 Ventas por día últimos 7 días
  const getDailyReport = async (params = {}, force = false) => {
    console.log(params, force);
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/daily?${q}`, setDaily, "daily", force);
  };

  // 🔸 Ventas por método de pago últimos 30 días o por rango
  const getPaymentReport = async (params = {}, force = false) => {
    console.log(params, force);
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/payment-method?${q}`,
      setPayment,
      `payment-${q}`,
      force
    );
  };

  // 🔸 Ventas por categoría últimos 30 días o por rango
  const getCategoryReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/category?${q}`,
      setCategory,
      `category-${q}`,
      force
    );
  };

  // 🔸 Ventas por vendedor últimos 30 días o por rango
  const getSellerReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/seller?${q}`, setSeller, `seller-${q}`, force);
  };

  // 🔸 Ventas por productos (hasta 5) por rango
  const getSalesByProducts = async (params = {}, force = false) => {
    console.log(params);
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/products?${q}`,
      setProducts,
      `products-${q}`,
      force
    );
  };

  const searchProductVariants = async (query) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/reports/variants/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Error al buscar variantes");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  return (
    <ReportContext.Provider
      value={{
        summary,
        daily,
        payment,
        category,
        seller,
        products,
        setProducts,
        loading,
        searchProductVariants,
        getSummaryReport,
        getDailyReport,
        getPaymentReport,
        getCategoryReport,
        getSellerReport,
        getSalesByProducts,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
