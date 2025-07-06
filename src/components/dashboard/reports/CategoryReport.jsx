import React from "react";
import { Pie } from "react-chartjs-2";
import actualizar from "../../../images/actualizar.png";

export default function CategoryReport({
  category,
  categoryDateRange,
  setCategoryDateRange,
  handleCategoryRefresh,
}) {
  const greenShades = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(34, 139, 34, 0.6)",
    "rgba(0, 128, 0, 0.6)",
    "rgba(144, 238, 144, 0.6)",
    "rgba(0, 100, 0, 0.6)",
  ];

  return (
    <div className="border-y-2 border-neutral-300 mt-6 py-6">
      <section>
        <h3 className="text-green-800 text-3xl">Ventas por Categoría</h3>
        <div className="flex flex-wrap items-center mt-2 gap-2">
          <label className="text-green-800 text-xl">Desde:</label>
          <input
            type="date"
            max={categoryDateRange.end}
            value={categoryDateRange.start}
            className="px-2 py-1"
            onChange={(e) =>
              setCategoryDateRange({
                ...categoryDateRange,
                start: e.target.value,
              })
            }
          />
          <label className="text-green-800 text-xl ml-3">Hasta:</label>
          <input
            type="date"
            min={categoryDateRange?.start}
            value={categoryDateRange?.end}
            className="px-2 py-1"
            onChange={(e) =>
              setCategoryDateRange({
                ...categoryDateRange,
                end: e.target.value,
              })
            }
          />
          <button
            className="bg-green-200 h-8 ml-2 flex gap-1 hover:bg-green-300 transition border border-green-700"
            onClick={handleCategoryRefresh}
          >
            <p className="text-green-900">Actualizar</p>
            <img className="w-5 object-contain" src={actualizar} alt="" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row mt-4">
          {/* Tabla */}
          <section className="w-9/12 md:w-8/12 flex justify-center">
            <table className="w-full text-md">
              <thead className="bg-neutral-200 z-10">
                <tr className="border-b-2 border-neutral-300">
                  <th className="text-green-800 font-medium text-md py-3 pl-1">
                    Categoría
                  </th>
                  <th className="text-green-800 font-medium text-md py-2 pl-1">
                    Transacciones
                  </th>
                  <th className="text-green-800 font-medium text-md py-2 pl-1">
                    Monto Recaudado
                  </th>
                  <th className="text-green-800 font-medium text-md py-2 pl-1">
                    Promedio p/Transacción
                  </th>
                </tr>
              </thead>
              <tbody>
                {category?.length > 0 ? (
                  category.map((c, index) => (
                    <tr
                      key={index}
                      className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition"
                    >
                      <td className="pl-1 capitalize font-medium">
                        {c.category}
                      </td>
                      <td className="px-2">
                        {c.transactionCount.toLocaleString("es-PY")}
                      </td>
                      <td>
                        {c.totalSales.toLocaleString("es-PY", {
                          style: "currency",
                          currency: "PYG",
                        })}
                      </td>
                      <td>
                        {(c.totalSales / c.transactionCount).toLocaleString(
                          "es-PY",
                          {
                            style: "currency",
                            currency: "PYG",
                          }
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-neutral-200">
                <tr className="font-medium">
                  <td className="text-green-800 pl-1 py-3">Total</td>
                  <td className="text-green-800 pl-2">
                    {category
                      ?.reduce((sum, item) => sum + item.transactionCount, 0)
                      .toLocaleString("es-PY")}
                  </td>
                  <td className="text-green-800">
                    {category
                      ?.reduce((sum, item) => sum + item.totalSales, 0)
                      .toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                      })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* Gráfico */}
          <section className="w-full md:w-[35%] pr-0 pt-4 flex justify-center">
            <Pie
              data={{
                labels: category?.map((c) => c.category),
                datasets: [
                  {
                    label: "Ventas por Categoría",
                    data: category?.map((c) => c.totalSales),
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
                    position: "bottom",
                  },
                },
              }}
            />
          </section>
        </div>
      </section>
    </div>
  );
}
