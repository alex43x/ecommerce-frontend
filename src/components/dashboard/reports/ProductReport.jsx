import React, { useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";

export default function ProductReport({
  products,
  productsWeekly,
  productDateRange,
  setProductDateRange,
  productMode,
}) {
  const greenShades = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(34, 139, 34, 0.6)",
    "rgba(0, 128, 0, 0.6)",
    "rgba(144, 238, 144, 0.6)",
    "rgba(0, 100, 0, 0.6)",
  ];

  useEffect(() => {
    console.log("weekly", productsWeekly);
  }, [productsWeekly]);

  const renderDateInputs = () => (
    <div className="flex flex-wrap items-center mt-2 gap-2">
      <label className="text-green-800 text-xl">Desde:</label>
      <input
        type="date"
        className="px-2 py-1"
        max={productDateRange.end}
        value={productDateRange.start}
        onChange={(e) =>
          setProductDateRange({ ...productDateRange, start: e.target.value })
        }
      />
      <label className="text-green-800 text-xl ml-3">Hasta:</label>
      <input
        type="date"
        className="px-2 py-1"
        min={productDateRange.start}
        value={productDateRange.end}
        onChange={(e) =>
          setProductDateRange({ ...productDateRange, end: e.target.value })
        }
      />
    </div>
  );

  const renderBarChart = () =>
    products?.length > 0 && (
      <div className="flex flex-col md:flex-row mt-4 gap-4">
        <section className="w-full md:w-7/12 pt-4 flex">
          <Bar
            data={{
              labels: products.map((p) => p.name),
              datasets: [
                {
                  label: "Ventas Totales",
                  data: products.map((p) => p.totalRevenue),
                  backgroundColor: greenShades,
                  borderColor: "rgba(0, 100, 0, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  position: "left",
                },
              },
            }}
          />
        </section>
        <section className="w-9/12 md:w-8/12 flex justify-center ">
          <table className="w-full text-md">
            <thead className="bg-neutral-200">
              <tr className="border-b-2 border-neutral-300">
                <th className="text-green-800 font-medium text-md py-4 pl-1">
                  Producto
                </th>
                <th className="text-green-800 font-medium text-md py-2 pl-1">
                  Monto Recaudado
                </th>
                <th className="text-green-800 font-medium text-md py-2 pl-1">
                  Unidades Vendidas
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={i}
                  className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition "
                >
                  <td className="capitalize font-medium pl-1 py-1">{p.name}</td>
                  <td>
                    {p.totalRevenue.toLocaleString("es-PY", {
                      style: "currency",
                      currency: "PYG",
                    })}
                  </td>
                  <td>{p.totalQuantity.toLocaleString("es-PY")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-neutral-200">
              <tr className="font-medium">
                <td className="text-green-800 pl-1 py-3">Total</td>
                <td className="text-green-800">
                  {products
                    .reduce((sum, p) => sum + p.totalRevenue, 0)
                    .toLocaleString("es-PY", {
                      style: "currency",
                      currency: "PYG",
                    })}
                </td>
                <td className="text-green-800">
                  {products
                    .reduce((sum, p) => sum + p.totalQuantity, 0)
                    .toLocaleString("es-PY")}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );

  const renderLineChart = () =>
    productsWeekly?.datasets?.length > 0 && (
      <div className="mt-6">
        <section className="w-full flex  mt-4">
          <table className="w-full text-md">
            <thead className="bg-neutral-200">
              <tr className="border-b-2 border-neutral-300">
                <th className="text-green-800 font-medium text-md py-4 pl-1">
                  Periodo
                </th>
                {productsWeekly.datasets.map((p, i) => (
                  <th
                    key={i}
                    className="text-green-800 font-medium text-md py-2 pl-1"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productsWeekly.labels.map((label, i) => (
                <tr
                  key={i}
                  className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition"
                >
                  <td className="capitalize font-medium pl-1 py-2">{label}</td>
                  {productsWeekly.datasets.map((ds, j) => (
                    <td key={j}>
                      {ds.data[i].toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-neutral-200">
              <tr className="font-medium">
                <td className="text-green-800 pl-1 py-3">Total</td>
                {productsWeekly.datasets.map((ds, i) => (
                  <td key={i} className="text-green-800">
                    {ds.data
                      .reduce((sum, val) => sum + val, 0)
                      .toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                      })}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </section>
        <section className="w-full">
          <Line
            data={{
              labels: productsWeekly.labels,
              datasets: productsWeekly.datasets.map((d, i) => ({
                label: d.name,
                data: d.data,
                borderColor: greenShades[i % greenShades.length],
                backgroundColor: greenShades[i % greenShades.length],
                fill: false,
                tension: 0.2,
              })),
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </section>
      </div>
    );

  return (
    <div>
      {productMode === "Semanal" ? (
        renderLineChart()
      ) : (
        <>
          {renderDateInputs()}
          {renderBarChart()}
        </>
      )}
    </div>
  );
}
