import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

export default function Dashboard() {
  const { user } = useAuth();

  const fechaFormateada = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h1 className="text-green-800 inline">Dashboard</h1>
      <p className=" font-medium my-4 inline ml-6">{fechaFormateada}</p>
      <p className=" font-medium text-xl my-2">Hola, {user.name}</p>
      <DashboardTabs />
    </div>
  );
}
