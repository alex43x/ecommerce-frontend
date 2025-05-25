import React from "react";
import { Bar } from "react-chartjs-2";

import actualizar from "../../../images/actualizar.png";

export default function SellerReport({
  seller,
  sellerDateRange,
  setSellerDateRange,
  handleSellerRefresh,
}) {
  const greenShades = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(34, 139, 34, 0.6)",
    "rgba(0, 128, 0, 0.6)",
    "rgba(144, 238, 144, 0.6)",
    "rgba(0, 100, 0, 0.6)",
  ];

  return (
    <div className="mb-6 border border-b border-neutral-200">
      <section>
        <h3 className="text-green-800 text-3xl font-semibold">Vendedores</h3>
        <div className="flex flex-wrap items-center mt-2">
          <label className="font-medium text-lg mr-1">Desde:</label>
          <input
            type="date"
            className="px-2 py-1"
            value={sellerDateRange?.start}
            max={sellerDateRange?.end}
            onChange={(e) =>
              setSellerDateRange({ ...sellerDateRange, start: e.target.value })
            }
          />
          <label className="font-medium text-lg mr-1 ml-4">Hasta:</label>
          <input
            type="date"
            className="px-2 py-1"
            value={sellerDateRange.end}
            min={sellerDateRange.start}
            onChange={(e) =>
              setSellerDateRange({ ...sellerDateRange, end: e.target.value })
            }
          />
          <button
            className="bg-green-200 h-8 ml-2 flex gap-1 hover:bg-green-300 transition border border-green-700"
            onClick={handleSellerRefresh}
          >
            <p className="text-green-900  ">Actualizar</p>
            <img className="w-5 object-contain" src={actualizar} alt="" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row ">
          <section className="w-full xl:h-[400px] md:w-[55%] pr-0  pt-4 flex ">
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
          </section>

          <section className="w-full md:w-5/12 pl-0 md:pl-4 pt-4 flex">
            <table className="w-full text-md ">
              <thead>
                <tr className="border-b-2 border-neutral-300 ">
                  <th className="">Vendedor</th>
                  <th>Transacciones</th>
                  <th>Total</th>
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {seller?.length > 0 &&
                  seller.map((s, index) => (
                    <tr key={index}>
                      <td>{s.sellerName}</td>
                      <td>{s.transactionCount.toLocaleString()}</td>
                      <td>{s.totalSales.toLocaleString()}</td>
                      <td>{(s.totalSales/s.transactionCount).toFixed()}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td>Total</td>
                  <td>
                    
                    {seller
                      ?.reduce((sum, s) => sum + s.transactionCount, 0)
                      .toLocaleString("es-ES")}
                  </td>
                  <td>
                    ₲{" "}
                    {seller
                      ?.reduce((sum, s) => sum + s.totalSales, 0)
                      .toLocaleString("es-ES")}
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
