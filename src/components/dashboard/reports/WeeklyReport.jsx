import React from "react";
import { Bar } from "react-chartjs-2";

import actualizar from "../../../images/actualizar.png";

export default function WeeklyReport({
  daily,
  dailyDateRange,
  setDailyDateRange,
  handleDailyRefresh,
}) {
  const greenShades = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(34, 139, 34, 0.6)",
    "rgba(0, 128, 0, 0.6)",
    "rgba(144, 238, 144, 0.6)",
    "rgba(0, 100, 0, 0.6)",
  ];
  

  return (
    <div className="mb-6">
      <section>
        <h3 className="text-green-800 text-3xl font-semibold">Última semana</h3>
        <div className="flex flex-wrap items-center mt-2">
          <label className="font-medium text-lg mr-1">Desde:</label>
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
            <p className="text-green-900  ">Actualizar</p>
            <img className="w-5 object-contain" src={actualizar} alt="" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row ">
          <section className="w-full xl:h-[400px] md:w-[55%] pr-0  pt-4 flex ">
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
          </section>

          <section className="w-full md:w-5/12 pl-0 md:pl-4 pt-4 flex">
            <table className="w-full text-md ">
              <thead>
                <tr className="border-b-2 border-neutral-300 ">
                  <th className="pb-1">Día</th>
                  <th>Monto Recaudado</th>
                  <th>Cambio</th>
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
                      <tr key={index} className="border-b-2 border-neutral-300">
                        <td className="py-1">{day.date}</td>
                        <td>₲ {day.totalSales.toLocaleString("es-ES")}</td>
                        <td>
                          {percentage !== null ? (
                            <div
                              className={
                                percentage > 0
                                  ? "bg-green-200 rounded-md px-2 mt-1 inline-block"
                                  : percentage < 0
                                  ? "bg-red-200 rounded-md px-2 mt-1 inline-block"
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
              <tfoot>
                <tr className="font-medium">
                  <td>Total</td>
                  <td>
                    ₲ {daily?.reduce((sum, day) => sum + day.totalSales, 0).toLocaleString("es-ES")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>
        </div>
      </section>
    </div>
  );
}
