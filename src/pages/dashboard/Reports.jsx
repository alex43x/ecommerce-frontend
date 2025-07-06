import React, { useEffect, useState } from "react";
import { useReport } from "../../context/report/ReportContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";

import dayjs from "dayjs";

import ProductVariantSelector from "../../components/dashboard/reports/ProductVariantSelector";
import WeeklyReport from "../../components/dashboard/reports/weeklyReport";
import PaymentMethodReport from "../../components/dashboard/reports/PaymentMethodReport";
import CategoryReport from "../../components/dashboard/reports/CategoryReport";
import SellerReport from "../../components/dashboard/reports/SellerReport";
import ProductReport from "../../components/dashboard/reports/ProductReport";
import CashClosingReport from "../../components/dashboard/reports/CashClosingReport";

import actualizar from "../../images/actualizar.png";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

export default function Reports() {
  const {
    getDailyReport,
    getPaymentReport,
    getCategoryReport,
    getSellerReport,
    getSalesByProducts,
    getSalesByProductsWeekly,
    products,
    setProducts,
    productsWeekly,
    setProductsWeekly,
    daily,
    payment,
    category,
    seller,
  } = useReport();

  const [productMode, setProductMode] = useState("Semanal");
  const [selectedVariants, setSelectedVariants] = useState([]);

  const [dailyDateRange, setDailyDateRange] = useState({
    start: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  });

  const [paymentDateRange, setPaymentDateRange] = useState({
    start: dayjs().startOf("month").format("YYYY-MM-DD"),
    end: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const [categoryDateRange, setCategoryDateRange] = useState({
    start: dayjs().startOf("month").format("YYYY-MM-DD"),
    end: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const [sellerDateRange, setSellerDateRange] = useState({
    start: dayjs().startOf("month").format("YYYY-MM-DD"),
    end: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const [productDateRange, setProductDateRange] = useState({
    start: dayjs().startOf("month").format("YYYY-MM-DD"),
    end: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  useEffect(() => {
    handleDailyRefresh();
    handlePaymentRefresh();
    handleCategoryRefresh();
    handleSellerRefresh();
  }, []);

  // Fetch de ventas totales
  useEffect(() => {
    const fetchSalesData = async () => {
      if (selectedVariants.length > 0) {
        const productIds = selectedVariants.map((v) => v.variantId);
        const data = await getSalesByProducts(
          {
            productIds,
            startDate: productDateRange.start,
            endDate: productDateRange.end,
          },
          true
        );
        setProducts(data);
      } else {
        setProducts([]);
      }
    };
    fetchSalesData();
  }, [selectedVariants, productDateRange.start, productDateRange.end]);

  // Fetch de ventas semanales
  useEffect(() => {
    const fetchWeeklySales = async () => {
      if (selectedVariants.length > 0) {
        const productIds = selectedVariants.map((v) => v.variantId);
        const data = await getSalesByProductsWeekly({ productIds }, true);
        setProductsWeekly(data);
      } else {
        setProductsWeekly([]);
      }
    };
    fetchWeeklySales();
  }, [selectedVariants]);

  const handleDailyRefresh = () => {
    getDailyReport({ startDate: dailyDateRange.start }, true);
  };

  const handlePaymentRefresh = () => {
    getPaymentReport(
      {
        startDate: paymentDateRange.start,
        endDate: paymentDateRange.end,
      },
      true
    );
  };

  const handleCategoryRefresh = () => {
    getCategoryReport(
      {
        startDate: categoryDateRange.start,
        endDate: categoryDateRange.end,
      },
      true
    );
  };

  const handleSellerRefresh = () => {
    getSellerReport(
      {
        startDate: sellerDateRange.start,
        endDate: sellerDateRange.end,
      },
      true
    );
  };

  return (
    <div>
      {/* Cierre de caja */}
      <CashClosingReport />

      {/* Ventas por día */}
      <WeeklyReport
        daily={daily}
        dailyDateRange={dailyDateRange}
        setDailyDateRange={setDailyDateRange}
        handleDailyRefresh={handleDailyRefresh}
      />

      {/* Método de pago */}
      <PaymentMethodReport
        payment={payment}
        paymentDateRange={paymentDateRange}
        setPaymentDateRange={setPaymentDateRange}
        handlePaymentRefresh={handlePaymentRefresh}
      />

      {/* Categorías */}
      <CategoryReport
        category={category}
        categoryDateRange={categoryDateRange}
        setCategoryDateRange={setCategoryDateRange}
        handleCategoryRefresh={handleCategoryRefresh}
      />

      {/* Vendedores */}
      <SellerReport
        seller={seller}
        sellerDateRange={sellerDateRange}
        setSellerDateRange={setSellerDateRange}
        handleSellerRefresh={handleSellerRefresh}
      />

      {/* Productos seleccionados */}
      <div className="flex gap-2 my-2 items-center">
        <h3 className="text-3xl text-green-800  mb-2">
          Productos - <span>{productMode}</span>
        </h3>
        <button
          className="bg-green-200 rounded-lg border border-green-900 hover:bg-green-300"
          onClick={() => {
            if (productMode === "Semanal") {
              setProductMode("Acumulado");
            } else {
              setProductMode("Semanal");
            }
          }}
        >
          <img className="w-4 object-contain" src={actualizar} alt="" />
        </button>
      </div>

      <ProductVariantSelector
        selectedVariants={selectedVariants}
        setSelectedVariants={setSelectedVariants}
      />

      <ProductReport
        products={products}
        productsWeekly={productsWeekly}
        productDateRange={productDateRange}
        setProductDateRange={setProductDateRange}
        productMode={productMode}
      ></ProductReport>
      <div className="h-48"></div>
    </div>
  );
}
