import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DashboardTabs from "../../components/dashboard/DashboardTabs";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const { logout, user } = useAuth();
  const nav=useNavigate();
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
      <button onClick={()=>{nav("/config")}}>Config</button>
      <DashboardTabs/>
    </div>
  );
}
