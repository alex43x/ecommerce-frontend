import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import PosTabs from "../../components/pos/PosTabs";
import OrderView from "../../components/pos/OrderView";
import ProductFormModal from "../../components/dashboard/products/ProductFormModal";
import OrderDetail from "../../components/pos/OrderConfirm";
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
  const [confirmOrder, setConfirmOrder] = useState(false);

  return (
    <div>
      <section className="w-[13%] fixed h-screen top-0 left-0 z-0 bg-[#e5faf1] flex flex-col justify-between  overflow-hidden">
        <div>
          <h1 className="ml-4 mt-4">POS</h1>
          <p className="text-green-800 ml-4 font-medium">Tienda</p>

          {/* Resaltador animado */}
          <div
            ref={containerRef}
            className="mt-12 flex flex-col px-1 relative z-10"
          >
            {/* Resaltador animado, ahora adentro del contenedor correcto */}
            <div
              className="absolute left-0 w-full h-8 bg-green-200 border-l-4 border-green-900 rounded-r-xl transition-all duration-300"
              style={{ top: `${highlightY}px` }}
            />

            <button
              ref={tabRefs.foods}
              className="text-left ml-1 mb-2 px-2 py-1 z-2"
              onClick={() => setActiveTab("foods")}
            >
              Comestibles
            </button>
            <button
              ref={tabRefs.drinks}
              className="text-left ml-1 mb-2 px-2 py-1 z-2"
              onClick={() => setActiveTab("drinks")}
            >
              Bebidas
            </button>
            <button
              ref={tabRefs.pending}
              className="text-left ml-1 px-2 py-1 z-2"
              onClick={() => setActiveTab("pending")}
            >
              Pendientes
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col mx-1">
          {user.role === "admin" && (
            <button
              className="text-center bg-green-200 border border-green-900 mb-2"
              onClick={() => nav("/Dashboard")}
            >
              Menú Principal
            </button>
          )}
          <button
            className="text-center bg-green-200 border border-green-900"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </section>

      {/* Contenido principal con margen izquierdo y derecho */}
      <section className="ml-[12%] mr-[27%] px-6">
        <PosTabs activeTab={activeTab} />
      </section>

      {/* Vista de orden fija a la derecha */}
      <section className="w-[28%] h-screen fixed right-0 top-0 bg-[#e5faf1] z-10 overflow-y-auto px-2">
        <OrderView
          onConfirm={() => {
            setConfirmOrder(true);
          }}
        />
      </section>

      {/* Modal */}
      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => setConfirmOrder(false)}
      >
        <OrderDetail  onExit={() => setConfirmOrder(false)} />
      </ProductFormModal>
    </div>
  );
}
