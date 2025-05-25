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
    <div className="border-y-2 border-neutral-300 my-6 py-4 ml-4">
      <h3 className="text-green-800 text-3xl font-semibold mt-6">Categorías</h3>
      <div className="flex flex-wrap items-center mt-2">
        <label className="font-medium text-lg mr-1">Desde:</label>
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
        <label className="font-medium text-lg ml-3 mr-1">Hasta:</label>
        <input
          type="date"
          min={categoryDateRange?.start}
          value={categoryDateRange?.end}
          className="px-2 py-1"
          onChange={(e) =>
            setCategoryDateRange({ ...categoryDateRange, end: e.target.value })
          }
        />
        <button
          className="bg-green-200 h-8 ml-2 flex gap-1 hover:bg-green-300 transition border border-green-700"
          onClick={handleCategoryRefresh}
        >
          <p className="text-green-900  ">Actualizar</p>
          <img className="w-5 object-contain" src={actualizar} alt="" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row mt-4">
        <section className="w-9/12 md:w-8/12 flex justify-center">
          <table className="w-full text-md ">
            <thead>
              <tr className="border-b-2 border-neutral-300 ">
                <th className="py-4">Categoría</th>
                <th>Transacciones</th>
                <th>Monto Recaudado</th>
                <th>Promedio p/ Transacción</th>
              </tr>
            </thead>
            <tbody>
              {category?.length > 0 &&
                category.map((c, index) => (
                  <tr key={index}>
                    <td>{c.category}</td>
                    <td>{c.transactionCount}</td>
                    <td>{c.totalSales}</td>
                    <td>{(c.totalSales / c.transactionCount).toFixed()}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="font-medium">
                <td className=" py-4">Total</td>
                <td>
                  {category
                    ?.reduce((sum, method) => sum + method.transactionCount, 0)
                    .toLocaleString("es-ES")}
                </td>
                <td>
                  ₲{" "}
                  {category
                    ?.reduce((sum, method) => sum + method.totalSales, 0)
                    .toLocaleString("es-ES")}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
        <section className="w-full h-[400px] md:w-[35%] pr-0 pt-4 flex justify-center ">
          <Pie
            data={{
              datasets: [
                {
                  label: "Método de Pago",
                  data: category?.map((p) => p.totalSales),
                  backgroundColor: greenShades,
                },
              ],
              labels: category?.map((p) => p.category),
            }}
          />
        </section>
      </div>
    </div>
  );
}
