import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
export default function DashboardLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex">
      <button
        onClick={() => {
          nav("/dashboard");
        }}
      >
        Dashboard
      </button>
      <button
        onClick={() => {
          nav("/pos");
        }}
      >
        Ir al pos
      </button>
      <button
        onClick={() => {
          nav("/config");
        }}
      >
        Configuración
      </button>
      <button
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesión
      </button>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
