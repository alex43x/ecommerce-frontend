import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import POS from "./pages/pos/Pos";
import Unauthorized from "./pages/Unauthorized";
import DashboardLayout from "./layouts/DashboardLayout";

import { ProductProvider } from "./context/product/ProductProvider";
import { SaleProvider } from "./context/sale/SaleProvider";
import { UserProvider } from "./context/user/UserProvider";
import ConfigAdmin from "./pages/config/ConfigAdmin";
import PosLayout from "./layouts/PosLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rutas para Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <SaleProvider>
                <ProductProvider>
                  <Dashboard />
                </ProductProvider>
              </SaleProvider>
            }
          />
          <Route
            path="/config"
            element={
              <UserProvider>
                <ConfigAdmin />
              </UserProvider>
            }
          />
        </Route>
      </Route>
      {/* Rutas para Admin y Users */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "cashier"]} />}>
        <Route path="/" element={<PosLayout />}>
          <Route path="/pos" element={<POS />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
