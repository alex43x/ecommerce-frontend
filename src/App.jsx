import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import POS from "./pages/pos/Pos";
import Unauthorized from "./pages/Unauthorized";
import DashboardLayout from "./layouts/DashboardLayout";

import { useAuth } from "./context/auth/AuthContext";
import { ProductProvider } from "./context/product/ProductProvider";
import { SaleProvider } from "./context/sale/SaleProvider";
import { UserProvider } from "./context/user/UserProvider";
import ConfigAdmin from "./pages/config/ConfigAdmin";
import PosLayout from "./layouts/PosLayout";
import { CartProvider } from "./context/cart/CartProvider";
import { ReportProvider } from "./context/report/ReportProvider";
import { CustomerProvider } from "./context/customer/CustomerProvider";

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>; // 👈 Evita render antes de validar

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rutas para Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "spadmin"]} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <CustomerProvider>
                <UserProvider>
                  <SaleProvider>
                    <CartProvider>
                      <ProductProvider>
                        <ReportProvider>
                          <Dashboard />
                        </ReportProvider>
                      </ProductProvider>
                    </CartProvider>
                  </SaleProvider>
                </UserProvider>
              </CustomerProvider>
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
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "cashier", "spadmin"]} />
        }
      >
        <Route
          path="/pos"
          element={
            <CustomerProvider>
              <SaleProvider>
                <CartProvider>
                  <ProductProvider>
                    <POS />
                  </ProductProvider>
                </CartProvider>
              </SaleProvider>
            </CustomerProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
