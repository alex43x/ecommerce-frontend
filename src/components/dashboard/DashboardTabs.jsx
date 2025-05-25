import React, { useState } from "react";
import Reports from "../../pages/dashboard/Reports";
import Sales from "../../pages/dashboard/Sales";
import Products from "../../pages/dashboard/Products";

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("products");

  const tabClasses = (tab) =>
    `px-4 py-2 rounded-md text-sm transition-colors ${
      activeTab === tab
        ? "bg-green-700 text-white"
        : "bg-gray-200 hover:bg-gray-300 border border-green-700 text-green-800"
    }`;

  return (
    <div className="">
      {/* Tabs visibles en todo momento */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button className={tabClasses("products")} onClick={() => setActiveTab("products")}>
          Productos
        </button>
        <button className={tabClasses("sales")} onClick={() => setActiveTab("sales")}>
          Ventas
        </button>
        <button className={tabClasses("reportes")} onClick={() => setActiveTab("reportes")}>
          Reportes
        </button>
      </div>

      {/* Contenido dinámico */}
      {activeTab === "products" && (
        <Products activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {activeTab === "sales" && <Sales />}
      {activeTab === "reportes" && <Reports />}
    </div>
  );
}
