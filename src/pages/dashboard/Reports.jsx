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
import { Bar, Pie } from "react-chartjs-2";
import dayjs from "dayjs";
import ProductVariantSelector from "../../components/dashboard/reports/ProductVariantSelector"; // asegúrate de tener este componente

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
    products,
    setProducts,
    daily,
    payment,
    category,
    seller,
  } = useReport();

  const [selectedVariants, setSelectedVariants] = useState([]);

  useEffect(() => {
    console.log(selectedVariants);
  }, [selectedVariants]);
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

  useEffect(() => {
    const fetchSalesData = async () => {
      if (selectedVariants.length > 0) {
        const productIds = selectedVariants.map((v) => v.variantId);
        console.log(productIds);
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
  useEffect(() => {
    console.log(products);
  }, [products]);

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

  const handleProductRefresh = () => {
    // simplemente vuelve a llamar al efecto
    setSelectedVariants([...selectedVariants]);
  };

  const greenShades = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(34, 139, 34, 0.6)",
    "rgba(0, 128, 0, 0.6)",
    "rgba(144, 238, 144, 0.6)",
    "rgba(0, 100, 0, 0.6)",
  ];

  return (
    <div>
      <h2>Reportes</h2>

      {/* Ventas por día */}
      <div>
        <h3>Ventas por Día</h3>
        <label>Inicio:</label>
        <input
          type="date"
          value={dailyDateRange.start}
          max={dailyDateRange.end}
          onChange={(e) =>
            setDailyDateRange({ ...dailyDateRange, start: e.target.value })
          }
        />
        <label>Fin:</label>
        <input
          type="date"
          min={dailyDateRange.start}
          value={dailyDateRange.end}
          onChange={(e) =>
            setDailyDateRange({ ...dailyDateRange, end: e.target.value })
          }
        />
        <button onClick={handleDailyRefresh}>Actualizar</button>
        <Bar
          data={{
            labels: daily?.map((d) => d.date),
            datasets: [
              {
                label: "Ventas",
                data: daily?.map((d) => d.totalSales),
                backgroundColor: greenShades,
              },
            ],
          }}
        />
      </div>

      {/* Método de pago */}
      <div>
        <h3>Ventas por Método de Pago</h3>
        <label>Inicio:</label>
        <input
          type="date"
          max={paymentDateRange.end}
          value={paymentDateRange.start}
          onChange={(e) =>
            setPaymentDateRange({ ...paymentDateRange, start: e.target.value })
          }
        />
        <label>Fin:</label>
        <input
          type="date"
          min={paymentDateRange.start}
          value={paymentDateRange.end}
          onChange={(e) =>
            setPaymentDateRange({ ...paymentDateRange, end: e.target.value })
          }
        />
        <button onClick={handlePaymentRefresh}>Actualizar</button>
        <Pie
          data={{
            labels: payment?.map((p) => p.paymentMethod),
            datasets: [
              {
                label: "Método de Pago",
                data: payment?.map((p) => p.totalSales),
                backgroundColor: greenShades,
              },
            ],
          }}
        />
      </div>

      {/* Categorías */}
      <div>
        <h3>Ventas por Categoría</h3>
        <label>Inicio:</label>
        <input
          type="date"
          max={categoryDateRange.end}
          value={categoryDateRange.start}
          onChange={(e) =>
            setCategoryDateRange({
              ...categoryDateRange,
              start: e.target.value,
            })
          }
        />
        <label>Fin:</label>
        <input
          type="date"
          min={categoryDateRange.start}
          value={categoryDateRange.end}
          onChange={(e) =>
            setCategoryDateRange({ ...categoryDateRange, end: e.target.value })
          }
        />
        <button onClick={handleCategoryRefresh}>Actualizar</button>
        <Pie
          data={{
            labels: category?.map((c) => c.category),
            datasets: [
              {
                label: "Categoría",
                data: category?.map((c) => c.totalSales),
                backgroundColor: greenShades,
              },
            ],
          }}
        />
      </div>

      {/* Vendedores */}
      <div>
        <h3>Ventas por Vendedor</h3>
        <label>Inicio:</label>
        <input
          type="date"
          value={sellerDateRange.start}
          max={sellerDateRange.end}
          onChange={(e) =>
            setSellerDateRange({ ...sellerDateRange, start: e.target.value })
          }
        />
        <label>Fin:</label>
        <input
          type="date"
          value={sellerDateRange.end}
          min={sellerDateRange.start}
          onChange={(e) =>
            setSellerDateRange({ ...sellerDateRange, end: e.target.value })
          }
        />
        <button onClick={handleSellerRefresh}>Actualizar</button>
        <Bar
          data={{
            labels: seller?.map((s) => s.sellerName),
            datasets: [
              {
                label: "Vendedor",
                data: seller?.map((s) => s.totalSales),
                backgroundColor: greenShades,
              },
            ],
          }}
        />
      </div>

      {/* Productos seleccionados */}
      <div>
        <h3>Ventas por Productos Seleccionados</h3>
        <ProductVariantSelector
          selectedVariants={selectedVariants}
          setSelectedVariants={setSelectedVariants}
        />
        <label>Inicio:</label>
        <input
          type="date"
          max={productDateRange.end}
          value={productDateRange.start}
          onChange={(e) =>
            setProductDateRange({ ...productDateRange, start: e.target.value })
          }
        />
        <label>Fin:</label>
        <input
          type="date"
          min={productDateRange.start}
          value={productDateRange.end}
          onChange={(e) =>
            setProductDateRange({ ...productDateRange, end: e.target.value })
          }
        />
        <button onClick={handleProductRefresh}>Actualizar</button>

        {products?.length > 0 && (
          <Bar
            data={{
              labels: products.map((p) => p.name),
              datasets: [
                {
                  label: "Ventas",
                  data: products.map((p) => p.totalRevenue),
                  backgroundColor: greenShades,
                },
              ],
            }}
          />
        )}
      </div>
    </div>
  );
}
