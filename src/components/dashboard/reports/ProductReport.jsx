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
    <div className="mb-2">
      <label className="mr-2 font-medium text-lg">Desde:</label>
      <input
        type="date"
        className="px-2 py-1"
        max={productDateRange.end}
        value={productDateRange.start}
        onChange={(e) =>
          setProductDateRange({ ...productDateRange, start: e.target.value })
        }
      />
      <label className="ml-4 mr-2 font-medium text-lg">Hasta:</label>
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
      <div className="flex flex-wrap">
        <section className="w-7/12 pr-6">
          <Bar
            className="mt-6"
            data={{
              labels: products.map((p) => p.name),
              datasets: [
                {
                  label: "Ventas totales",
                  data: products.map((p) => p.totalRevenue),
                  backgroundColor: greenShades,
                },
              ],
            }}
          />
        </section>
        <section className="w-5/12 flex pr-6">
          <table className="w-full text-md ">
            <thead>
              <tr className="border-b-2 border-neutral-300 ">
                <th className="py-4">Categoría</th>
                <th>Monto Recaudado</th>
                <th>Unidades Vendidas</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 ? (
                products.map((product, index) => {
                  return (
                    <tr key={index} className="border-b-2 border-neutral-300">
                      <td className="py-1 pr-1 capitalize font-medium">
                        {product.name}
                      </td>
                      <td>₲ {product.totalRevenue.toLocaleString("es-ES")}</td>
                      <td>{product.totalQuantity.toLocaleString("es-ES")}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-medium">
                <td className=" py-4">Total</td>
                <td>
                  ₲{" "}
                  {products?.reduce(
                    (sum, product) => sum + product.totalRevenue,
                    0
                  ).toLocaleString("es-ES")}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );

  const renderLineChart = () =>
    productsWeekly?.datasets?.length > 0 && (
      <div className="w-full">
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
        <section className="w-full flex px-6">
          <table className="w-full text-md ">
            <thead>
              <tr className="border-b-2 border-neutral-300 ">
                <th className="py-4">Periodo</th>
                {productsWeekly?.datasets?.map((p) => (
                  <th>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productsWeekly?.datasets?.length > 0 ? (
                productsWeekly?.labels?.map((label, index) => (
                  <tr key={index} className="border-b-2 border-neutral-300">
                    <td className="py-1 pr-1 capitalize font-medium">
                      {label}
                    </td>
                    {productsWeekly.datasets.map((ds, dsIndex) => (
                      <td key={dsIndex} className="py-1 pr-1 ">
                        ₲ {ds.data[index].toLocaleString("es-ES")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-medium">
                <td className="py-4">Total</td>
                {productsWeekly.datasets.map((ds, index) => (
                  <td key={index}>
                    ₲ {ds.data.reduce((sum, val) => sum + val, 0).toLocaleString("es-ES")}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );

  return (
    <div className="mt-4">
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
