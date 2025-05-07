import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
export default function PosLayout() {
  const { logout,user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex">
      <button
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesión
      </button>
      {user.role==="admin"&&(
        <button
        onClick={()=>{nav("/Dashboard")}}
      >Ir al Dashboard</button>
      )}
      
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
