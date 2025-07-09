import React, { useState } from "react";
import { ReportContext } from "./ReportContext";
import { useAuth } from "../auth/AuthContext"; // Importa el contexto de autenticación

export const ReportProvider = ({ children }) => {
  // Estados para cada tipo de reporte
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [payment, setPayment] = useState(null);
  const [category, setCategory] = useState(null);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState(null);
  const [productsWeekly, setProductsWeekly] = useState(null);
  const [cashClosing, setCashClosing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const token = localStorage.getItem("AuthToken");
  const { logout } = useAuth();

  // 🔐 Maneja respuesta 401 (token inválido o expirado)
  const handleUnauthorized = (res) => {
    if (res.status === 401) {
      logout();
      throw new Error("Token inválido o expirado");
    }
  };

  /**
   * Función genérica para obtener reportes desde el backend.
   * @param {string} url - Ruta del endpoint.
   * @param {Function} setData - Setter del estado.
   * @param {string} key - Nombre de la caché (actualmente no usada).
   * @param {boolean} force - Si debe forzar la actualización.
   */
  const fetchReport = async (url, setData, key, force = false) => {
    if (!force && fetched) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleUnauthorized(res);

      const data = await res.json();
      setData(data.data);
      setFetched(true);
    } catch (_) {
      // Silenciado para producción
    } finally {
      setLoading(false);
    }
  };

  // Reporte general resumido
  const getSummaryReport = async (force = false) => {
    fetchReport("/api/reports/totals", setSummary, "summary", force);
  };

  // Reporte de ventas por día
  const getDailyReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/daily?${q}`, setDaily, "daily", force);
  };

  // Reporte por métodos de pago
  const getPaymentReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/payment-method?${q}`,
      setPayment,
      `payment-${q}`,
      force
    );
  };

  // Reporte por categoría
  const getCategoryReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/category?${q}`,
      setCategory,
      `category-${q}`,
      force
    );
  };

  // Reporte por vendedor
  const getSellerReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(`/api/reports/seller?${q}`, setSeller, `seller-${q}`, force);
  };

  // Reporte acumulado por variantes de productos
  const getSalesByProducts = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/products?${q}`,
      setProducts,
      `products-${q}`,
      force
    );
  };

  // Reporte semanal por variantes de productos
  const getSalesByProductsWeekly = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/products/weekly?${q}`,
      setProductsWeekly,
      `products-${q}`,
      force
    );
  };

  // Reporte de cierre de caja
  const getCashClosingReport = async (params = {}, force = false) => {
    const q = new URLSearchParams(params).toString();
    fetchReport(
      `/api/reports/cash-closing?${q}`,
      setCashClosing,
      `cash-${q}`,
      force
    );
  };

  // Buscar variantes para el gráfico de productos
  const searchProductVariants = async (query) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reports/variants/search?q=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (_) {
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
