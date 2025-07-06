import React, { useState } from "react";
import { ReportContext } from "./ReportContext";

export const ReportProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [payment, setPayment] = useState(null);
  const [category, setCategory] = useState(null);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState(null);
  const [productsWeekly, setProductsWeekly] = useState(null);
  const [cashClosing, setCashClosing] = useState(null); // 🔸 Nuevo estado
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const token = localStorage.getItem("AuthToken");

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
      setData(data.data);
      setFetched(true);
    } catch (error) {
      console.error("Error al cargar reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSummaryReport = async (force = false) => {
    fetchReport("/api/reports/totals", setSummary, "summary", force);
  };

  const getDailyReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/daily?${q}`, setDaily, "daily", force);
  };

  const getPaymentReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/payment-method?${q}`, setPayment, `payment-${q}`, force);
  };

  const getCategoryReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/category?${q}`, setCategory, `category-${q}`, force);
  };

  const getSellerReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/seller?${q}`, setSeller, `seller-${q}`, force);
  };

  const getSalesByProducts = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/products?${q}`, setProducts, `products-${q}`, force);
  };

  const getSalesByProductsWeekly = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/products/weekly?${q}`, setProductsWeekly, `products-${q}`, force);
  };

  // 🔸 NUEVO: Cierre de caja por estado
  const getCashClosingReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/cash-closing?${q}`, setCashClosing, `cash-${q}`, force);
  };

  const searchProductVariants = async (query) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reports/variants/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Error al buscar variantes");
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
        productsWeekly,
        cashClosing, 
        setProducts,
        setProductsWeekly,
        loading,
        searchProductVariants,
        getSummaryReport,
        getDailyReport,
        getPaymentReport,
        getCategoryReport,
        getSellerReport,
        getSalesByProducts,
        getSalesByProductsWeekly,
        getCashClosingReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
