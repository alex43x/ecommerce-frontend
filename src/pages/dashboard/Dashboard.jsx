import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DashboardTabs from "../../components/dashboard/DashboardTabs";
export default function Dashboard() {
  const { logout, user } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hola, {user.name}</p>
      <button
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesión
      </button>
      <DashboardTabs/>
    </div>
  );
}
