import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col w-full ">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 flex-wrap gap-2 border-b-2 border-b-neutral-200 bg-neutral-200">
        <div>
          <h1 className="text-green-800 inline">POS </h1>
          <p className="inline font-bold text-3xl">Tienda</p>
        </div>
        <div className="flex flex-wrap ">
          <button className="text-green-900" onClick={() => nav("/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => nav("/pos")}>Pos</button>
          <button onClick={() => nav("/config")}>Configuración</button>
          <button onClick={() => logout()}> Cerrar Sesión </button>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
