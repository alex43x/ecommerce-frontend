import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Para decodificar el token JWT
import { AuthContext } from "./AuthContext"; // Contexto global de autenticación
import { useNavigate } from "react-router-dom"; // Para redirección de rutas
import Swal from "sweetalert2"; // Librería para mostrar alertas elegantes

// Componente proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para guardar datos del usuario autenticado
  const [authenticated, setAuthenticated] = useState(false); // Estado de autenticación
  const [loading, setLoading] = useState(true); // Estado de carga mientras se valida el token

  const navigate = useNavigate(); // Hook para redirección

  // Función que valida si el token JWT en localStorage es válido y no ha expirado
  const validateToken = () => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      // Si no hay token, se fuerza logout
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decodifica el token
      const tokenExpiration = decoded.exp * 1000; // Convierte el tiempo de expiración a milisegundos
      const now = Date.now();

      if (tokenExpiration < now) {
        // Si el token expiró, se borra y redirige a la pagina de login
        localStorage.removeItem("AuthToken");
        setAuthenticated(false);
        setUser(null);
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Por favor, inicia sesión nuevamente.",
        });
        navigate("/login");
        return;
      }

      // Si el token es válido y no expiró, actualiza los estados
      setUser(decoded);
      setAuthenticated(true);
    } catch {
      // Si el token es inválido (por ejemplo, mal formado)
      localStorage.removeItem("AuthToken");
      setUser(null);
      setAuthenticated(false);
      navigate("/login");
    } finally {
      setLoading(false); // Termina el estado de carga
    }
  };

  // Función para loguear un usuario: guarda token, decodifica y redirige según el rol
  const login = async (userData, token) => {
    localStorage.setItem("AuthToken", token); // Guarda el token
    const decoded = jwtDecode(token); // Decodifica el token

    setUser(userData.data.user); // Guarda los datos del usuario (puede mejorarse: usar decoded)
    setAuthenticated(true);

    try {
      // Verifica si el usuario está activo
      if (decoded.active === "disable") {
        throw new Error("User is inactive");
      }

      // Redirige según el rol
      if (decoded.role === "admin" || decoded.role === "spadmin") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    } catch (error) {
      // Si hay un error (por ejemplo, usuario inactivo)
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.message || "Error al iniciar sesión",
      });
      localStorage.removeItem("AuthToken");
      setUser(null);
      setAuthenticated(false);
    }
  };

  // Función para cerrar sesión (borra token y redirige)
  const logout = () => {
    localStorage.removeItem("AuthToken");
    setUser(null);
    setAuthenticated(false);
    window.location.replace("/login"); // Se recarga completamente para limpiar el estado
  };

  // useEffect que valida el token al iniciar la app y cada 60 segundos
  useEffect(() => {
    validateToken(); // Validación inicial

    const interval = setInterval(() => {
      validateToken(); // Validación cada minuto
    }, 60 * 1000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retorna el proveedor del contexto con todos los valores
  return (
    <AuthContext.Provider
      value={{ user, authenticated, loading, login, logout }}
    >
      {/* Mientras carga la validación, se muestra "Cargando..." */}
      {loading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );
};
