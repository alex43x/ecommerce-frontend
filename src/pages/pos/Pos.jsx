import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import PosTabs from "../../components/pos/PosTabs";
import OrderView from "../../components/pos/OrderView";
import casa from "../../images/casa.png";
import hamburgesa from "../../images/hamburguesa.png";
import soda from "../../images/soda.png";
import orden from "../../images/orden.png";
import log_out from "../../images/logout.png";
import usuario from "../../images/usuario.png";

import { useNavigate } from "react-router-dom";

export default function POS() {
  const tabRefs = {
    foods: useRef(null),
    drinks: useRef(null),
    pending: useRef(null),
  };
  const containerRef = useRef(null);

  const [highlightY, setHighlightY] = useState(0);
  const [activeTab, setActiveTab] = useState("foods");
  const updateHighlight = () => {
    const el = tabRefs[activeTab].current;
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeY = elRect.top - containerRect.top;
      setHighlightY(relativeY);
    }
  };

  useEffect(() => {
    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [activeTab]);

  const nav = useNavigate();
  const { logout, user } = useAuth();

  return (
    <div>
      <section className="w-[13%] fixed h-screen top-0 left-0 z-0 bg-[#e5faf1] flex flex-col justify-between  overflow-hidden">
        <div>
          <h1 className="ml-4 mt-5">POS</h1>
          <p className="text-green-800 ml-4 font-medium">Tienda</p>

          {/* Resaltador animado */}
          <div
            ref={containerRef}
            className="mt-12 flex flex-col pl-2 pr-1 relative z-10"
          >
            {/* Resaltador animado, ahora adentro del contenedor correcto */}
            <div
              className="absolute left-0 w-full h-10 bg-green-200 border-l-4 border-green-900 rounded-r-xl transition-all duration-300"
              style={{ top: `${highlightY}px` }}
            />

            <button
              ref={tabRefs.foods}
              className="flex text-left mb-2 py-2 z-2 gap-2 items-center"
              onClick={() => setActiveTab("foods")}
            >
              <img className="w-4 object-contain" src={hamburgesa} alt="" />
              <p>Comidas</p>
            </button>
            <button
              ref={tabRefs.drinks}
              className="flex text-left mb-2 py-2 z-2 gap-2 items-center"
              onClick={() => setActiveTab("drinks")}
            >
              <img className="w-4 object-contain" src={soda} alt="" />
              <p>Bebidas</p>
            </button>
            <button
              ref={tabRefs.pending}
              className="flex text-left mb-2 py-2 z-2 gap-2 items-center"
              onClick={() => setActiveTab("pending")}
            >
              <img className="w-4 h-4 object-contain" src={orden} alt="" />
              <p>Órdenes</p>
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col mx-1 px-1">
          <div className="flex rounded bg-green-200 font-medium mb-2 pl-2 py-1 border border-green-800 gap-2 ">
            <img className="w-4 object-contain" src={usuario} alt="" />
            <p> {user.name} </p>
          </div>
          {user.role === "admin"|| user.role==="spadmin" && (
            <button
              className="flex rounded bg-green-200 font-medium mb-2 pl-2 py-1 border border-green-800 gap-2  items-center"
              onClick={() => nav("/Dashboard")}
            >
              <img className="w-4  object-contain" src={casa} alt="" />
              <p>Menú</p>
            </button>
          )}
          <button
            className="flex rounded bg-green-200 font-medium mb-2 pl-2 py-1 border border-green-800 gap-2 "
            onClick={logout}
          >
            <img className="w-4 object-contain" src={log_out} alt="" />
            <p>Salir</p>
          </button>
        </div>
      </section>

      {/* Contenido principal con margen izquierdo y derecho */}
      <section className="ml-[12%] mr-[27.5%] px-6">
        <PosTabs activeTab={activeTab} />
      </section>

      {/* Vista de orden fija a la derecha */}
      <section className="w-[28.5%] h-screen fixed right-0 top-0 bg-[#e5faf1] z-10 overflow-y-auto px-2">
        <OrderView />
      </section>
    </div>
  );
}
