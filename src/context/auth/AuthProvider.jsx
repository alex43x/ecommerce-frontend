import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [autenticated, setAutenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const validateToken = () => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      setUser(null);
      setAutenticated(false);
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      const tokenExpiration = decoded.exp * 1000;
      const now = Date.now();
      if (tokenExpiration < now) {
        localStorage.removeItem("AuthToken");
        setAutenticated(false);
        setLoading(false);
      } else {
        setUser(decoded);
        setAutenticated(true);
      }
    } catch (error) {
      localStorage.removeItem("AuthToken");
      setUser(null);
      setAutenticated(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token) => {
    localStorage.setItem("AuthToken", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setAutenticated(true);

    try {
      // Verificar si el usuario está activo
      if (decoded.active === "disable") {
        throw new Error("User is inactive");
      }

      // Navegar según el rol del usuario
      if (decoded.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.message || "Error al iniciar sesión",
      });
      localStorage.removeItem("AuthToken");
      setUser(null);
      setAutenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("AuthToken");
    setUser(null);
    setAutenticated(false);
    window.location.replace("/login");
  };

  useEffect(() => {
    validateToken();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("AuthToken");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
      console.log(data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user) => {
    setLoading(true);
    const token = localStorage.getItem("AuthToken");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user) => {
    const token = localStorage.getItem("AuthToken");
    setLoading(true);
    const { _id, ...rest } = user;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rest),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("AuthToken");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        autenticated,
        loading,
        users,
        getUsers,
        updateUser,
        createUser,
        deleteUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
