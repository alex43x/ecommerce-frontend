import React, { useEffect, useState } from "react";
import { useReport } from "../../../context/report/ReportContext";
import actualizar from "../../../images/actualizar.png";

export default function CashClosingReport() {
  const { cashClosing, getCashClosingReport, loading } = useReport();
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [localLoading, setLocalLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const handleRefresh = async () => {
    try {
      setLocalLoading(true);
      await getCashClosingReport({ day: selectedDate }, true);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await handleRefresh();
    };
    loadData();
  }, [selectedDate]);

  useEffect(() => {
    // Asegurarnos de que cashClosing.totals sea un array
    if (cashClosing && cashClosing.details) {
      setReportData(Array.isArray(cashClosing.details) ? cashClosing.details : []);
    } else {
      setReportData([]);
    }
  }, [cashClosing]);

  // Calcular el total de forma segura
  const total = reportData.reduce((acc, item) => {
    return acc + (item?.totalAmount || 0);
  }, 0);

  const statusMap = {
    ordered: "Pendiente",
    completed: "Cerrados",
    canceled: "Cancelados",
  };

  return (
    <div className="mb-6">
      <section>
        <h3 className="text-green-800 text-3xl mb-2">Cierre de caja</h3>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-green-800 text-xl">Día:</label>
          <input
            type="date"
            className="px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            className="bg-green-200 h-8 ml-2 flex gap-1 hover:bg-green-300 transition border border-green-700"
            onClick={handleRefresh}
            disabled={localLoading}
          >
            <p className="text-green-900">Actualizar</p>
            {localLoading ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            ) : (
              <img className="w-5 object-contain" src={actualizar} alt="Actualizar" />
            )}
          </button>
        </div>

        <section className="w-full pt-2">
          <table className="w-full text-md">
            <thead className="bg-neutral-200 z-10">
              <tr className="border-b-2 border-neutral-300">
                <th className="text-green-800 font-medium text-md py-2 pl-1">
                  Estado
                </th>
                <th className="text-green-800 font-medium text-md py-2 pl-1">
                  Total Recaudado
                </th>
              </tr>
            </thead>
            <tbody>
              {loading || localLoading ? (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    Cargando datos...
                  </td>
                </tr>
              ) : reportData.length > 0 ? (
                reportData.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition"
                  >
                    <td className="capitalize font-medium pl-1 py-2">
                      {statusMap[item.status] || item.status}
                    </td>
                    <td>
                      {(item.totalAmount || 0).toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    No hay datos disponibles para esta fecha
                  </td>
                </tr>
              )}
            </tbody>
            {!loading && !localLoading && reportData.length > 0 && (
              <tfoot className="bg-neutral-200">
                <tr className="font-medium">
                  <td className="text-green-800 pl-1 py-3">Total</td>
                  <td className="text-green-800">
                    {total.toLocaleString("es-PY", {
                      style: "currency",
                      currency: "PYG",
                    })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </section>
      </section>
    </div>
  );
}