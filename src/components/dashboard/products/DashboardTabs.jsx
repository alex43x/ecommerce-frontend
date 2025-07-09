import React, { useState } from "react";
import Reports from "../../../pages/dashboard/Reports";
import Sales from "../../../pages/dashboard/Sales";
import Products from "../../../pages/dashboard/Products";
//import Customers from "../../../pages/dashboard/Customers";

import producto from "../../../images/producto.png";
import venta from "../../../images/venta.png";
import reporte from "../../../images/reporte.png";
//import cliente from "../../../images/cliente.png";

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("products");

  const tabClasses = (tab) =>
    `flex gap-2 items-center px-4 py-2 rounded-md text-md transition-colors border border-green-800 text-green-800 ${
      activeTab === tab
        ? "bg-green-300 text-green-800 "
        : "bg-green-100 hover:bg-green-200 "
    }`;

  return (
    <div className="">
      {/* Tabs visibles en todo momento */}
      <div className="flex flex-wrap items-center gap-2 mb-4 ">
        <button
          className={tabClasses("products")}
          onClick={() => setActiveTab("products")}
        >
          Productos
          <img className="w-5 object-contain" src={producto} alt="" />
        </button>
        <button
          className={tabClasses("sales")}
          onClick={() => setActiveTab("sales")}
        >
          Ventas
          <img className="w-5 object-contain" src={venta} alt="" />
        </button>
        <button
          className={tabClasses("reportes")}
          onClick={() => setActiveTab("reportes")}
        >
          Reportes
          <img className="w-5 object-contain" src={reporte} alt="" />
        </button>
        {/*
        <button
          className={tabClasses("clientes")}
          onClick={() => setActiveTab("clientes")}
        >
          Clientes
          <img className="w-5 object-contain" src={cliente} alt="" />
        </button>
        */}
      </div>

      {/* Contenido dinámico */}
      {activeTab === "products" && (
        <Products activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {activeTab === "sales" && <Sales />}
      {activeTab === "reportes" && <Reports />}
      {/*activeTab === "clientes" && <Customers />*/}
    </div>
  );
}
