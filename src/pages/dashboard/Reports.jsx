import React, { useEffect, useState } from "react";
import { useReport } from "../../context/report/ReportContext";

//componentes de Chart.js
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

// Librería para manejo de fechas
import dayjs from "dayjs";

// Importación de componentes de reportes
import ProductVariantSelector from "../../components/dashboard/reports/ProductVariantSelector";
import WeeklyReport from "../../components/dashboard/reports/WeeklyReport";
import PaymentMethodReport from "../../components/dashboard/reports/PaymentMethodReport";
import CategoryReport from "../../components/dashboard/reports/CategoryReport";
import SellerReport from "../../components/dashboard/reports/SellerReport";
import ProductReport from "../../components/dashboard/reports/ProductReport";
import CashClosingReport from "../../components/dashboard/reports/CashClosingReport";

// Imagen de botón actualizar
import actualizar from "../../images/actualizar.png";

// Registro de los componentes de Chart.js
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

  // Estado para alternar entre los modos de visualización de productos
  const [productMode, setProductMode] = useState("Semanal");

  // Variantes seleccionadas por el usuario
  const [selectedVariants, setSelectedVariants] = useState([]);

  // Rango de fechas para cada tipo de reporte
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

  // Al montar el componente, se cargan los reportes principales
  useEffect(() => {
    handleDailyRefresh();
    handlePaymentRefresh();
    handleCategoryRefresh();
    handleSellerRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para obtener datos acumulados de productos según fechas y variantes seleccionadas
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariants, productDateRange.start, productDateRange.end]);

  // Efecto para obtener ventas semanales de productos seleccionados
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariants]);

  // Funciones para refrescar los reportes individuales
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

      {/* Reporte de ventas por día */}
      <WeeklyReport
        daily={daily}
        dailyDateRange={dailyDateRange}
        setDailyDateRange={setDailyDateRange}
        handleDailyRefresh={handleDailyRefresh}
      />

      {/* Reporte de métodos de pago */}
      <PaymentMethodReport
        payment={payment}
        paymentDateRange={paymentDateRange}
        setPaymentDateRange={setPaymentDateRange}
        handlePaymentRefresh={handlePaymentRefresh}
      />

      {/* Reporte por categorías */}
      <CategoryReport
        category={category}
        categoryDateRange={categoryDateRange}
        setCategoryDateRange={setCategoryDateRange}
        handleCategoryRefresh={handleCategoryRefresh}
      />

      {/* Reporte por vendedores */}
      <SellerReport
        seller={seller}
        sellerDateRange={sellerDateRange}
        setSellerDateRange={setSellerDateRange}
        handleSellerRefresh={handleSellerRefresh}
      />

      {/* Título de sección y botón para alternar modo */}
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

      {/* Selector de variantes de productos */}
      <ProductVariantSelector
        selectedVariants={selectedVariants}
        setSelectedVariants={setSelectedVariants}
      />

      {/* Reporte de productos */}
      <ProductReport
        products={products}
        productsWeekly={productsWeekly}
        productDateRange={productDateRange}
        setProductDateRange={setProductDateRange}
        productMode={productMode}
      ></ProductReport>

      {/* Espaciador final */}
      <div className="h-48"></div>
    </div>
  );
}
