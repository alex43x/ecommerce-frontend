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
import { CartProvider } from "./context/cart/CartProvider";
import { ReportProvider } from "./context/report/ReportProvider";

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
              <UserProvider>
                <SaleProvider>
                  <ProductProvider>
                    <ReportProvider>
                      {" "}
                      <Dashboard />
                    </ReportProvider>
                  </ProductProvider>
                </SaleProvider>
              </UserProvider>
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
        <Route
          path="/pos"
          element={
            <SaleProvider>
              <CartProvider>
                <ProductProvider>
                  <POS />
                </ProductProvider>
              </CartProvider>
            </SaleProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
