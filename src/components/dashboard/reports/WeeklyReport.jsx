import React from "react";
import { Bar } from "react-chartjs-2";
import actualizar from "../../../images/actualizar.png";

export default function WeeklyReport({
  daily,
  dailyDateRange,
  setDailyDateRange,
  handleDailyRefresh,
}) {
  return (
    <div className="mb-6">
      <section>
        <h3 className="text-green-800 text-3xl ">Última semana</h3>
        <div className="flex flex-wrap items-center mt-2 gap-2">
          <label className="text-green-800 text-xl ">Desde:</label>
          <input
            type="date"
            className="px-2 py-1"
            value={dailyDateRange?.start}
            max={dailyDateRange?.end}
            onChange={(e) =>
              setDailyDateRange({ ...dailyDateRange, start: e.target.value })
            }
          />
          <button
            className="bg-green-200 h-8 ml-2 flex gap-1 hover:bg-green-300 transition border border-green-700"
            onClick={handleDailyRefresh}
          >
            <p className="text-green-900">Actualizar</p>
            <img className="w-5 object-contain" src={actualizar} alt="" />
          </button>
        </div>

        <div className="flex items-center flex-col md:flex-row gap-2">
          {/* Tabla */}
          <section className="w-full md:w-5/12 pt-4 flex">
            <table className="w-full text-md">
              <thead className="bg-neutral-200 z-10">
                <tr className="border-b-2 border-neutral-300">
                  <th className="text-green-800 font-medium text-md py-2 pl-1">
                    Día
                  </th>
                  <th className="text-green-800 font-medium text-md py-2 pl-1">
                    Monto Recaudado
                  </th>
                  <th className="text-green-800 font-medium text-md py-2 pl-1">
                    Cambio
                  </th>
                </tr>
              </thead>
              <tbody>
                {daily?.length > 0 ? (
                  daily.map((day, index) => {
                    const previous = daily[index - 1];
                    const percentage =
                      index > 0 && previous?.totalSales
                        ? (
                            ((day.totalSales - previous.totalSales) /
                              previous.totalSales) *
                            100
                          ).toFixed(1)
                        : null;

                    return (
                      <tr
                        key={index}
                        className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition"
                      >
                        <td className="py-1 pl-1">{day.date}</td>
                        <td>
                          {day.totalSales.toLocaleString("es-PY", {
                            style: "currency",
                            currency: "PYG",
                          })}
                        </td>
                        <td>
                          {percentage !== null ? (
                            <div
                              className={
                                percentage > 0
                                  ? "bg-green-200 border border-green-800 rounded-md px-2 inline-block"
                                  : percentage < 0
                                  ? "bg-red-200 border border-red-800 rounded-md px-2  inline-block"
                                  : ""
                              }
                            >
                              <p
                                className={
                                  percentage > 0
                                    ? "text-green-800 font-medium"
                                    : percentage < 0
                                    ? "text-red-800 font-medium"
                                    : ""
                                }
                              >
                                {percentage > 0 ? "+" : ""}
                                {percentage}%
                              </p>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3}>No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-neutral-200">
                <tr className="font-medium">
                  <td className="text-green-800 pl-1">Total</td>
                  <td className="text-green-800 py-2">
                    {daily
                      ?.reduce((sum, day) => sum + day.totalSales, 0)
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
          <section className="w-full xl:h-[400px] md:w-[55%] pr-0 pt-4 flex">
            <Bar
              data={{
                labels: daily?.map((d) => d.date),
                datasets: [
                  {
                    label: "Ventas",
                    data: daily?.map((d) => d.totalSales),
                    backgroundColor: "rgba(144, 238, 144, 0.6)", // Verde claro
                    borderColor: "rgba(0, 100, 0, 1)", // Verde oscuro
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
        </div>
      </section>
    </div>
  );
}
