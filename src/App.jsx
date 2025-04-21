import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import POS from "./pages/pos/Pos";
import Unauthorized from "./pages/Unauthorized";

import { ProductProvider } from "./context/product/ProductProvider";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rutas para Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/dashboard"
          element={
            <ProductProvider>
              <Dashboard />
            </ProductProvider>
          }
        />

        <Route path="/admin/config" element={<div>Config Admin</div>} />
      </Route>

      {/* Rutas para Admin y Users */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
        <Route path="/pos" element={<POS />} />
      </Route>
    </Routes>
  );
}

export default App;
