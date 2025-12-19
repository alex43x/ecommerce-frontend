import React, { useState, useCallback } from "react";
import { UserContext } from "./UserContext";
import { useAuth } from "../auth/AuthContext";

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [timbrados, setTimbrados] = useState([]);
  const [loadingCount, setLoadingCount] = useState(0); // contador de operaciones activas
  const [page, setPage] = useState(1); // página actual para paginación
  const [pageSize, setPageSize] = useState(20); // tamaño de página
  const [totalUsers, setTotalUsers] = useState(0); // total usuarios para paginación
  const [totalPages, setTotalPages] = useState(1);
  const { logout } = useAuth();

  // Loading derivado: true si hay alguna operación en curso
  const loading = loadingCount > 0;

  // Aumenta el contador de loading
  const startLoading = () => setLoadingCount((c) => c + 1);
  // Disminuye el contador de loading
  const endLoading = () => setLoadingCount((c) => Math.max(c - 1, 0));

  // Obtener headers con token para auth
  const getAuthHeaders = () => {
    const token = localStorage.getItem("AuthToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Manejar respuesta 401 -> logout y error
  const handleUnauthorized = (res) => {
    if (res.status === 401) {
      logout();
      throw new Error("Token inválido o expirado");
    }
  };

  // Obtener usuarios con paginación
  const getUsers = useCallback(
    async (pageParam = page, sizeParam = pageSize) => {
      startLoading();
      try {
        // Se asume que el backend acepta query params para paginación
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/users?page=${pageParam}&limit=${sizeParam}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        handleUnauthorized(res);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error al obtener usuarios");
        }

        const data = await res.json();
        setUsers(data.data); // datos paginados
        setTotalUsers(data.totalItems || 0); // total usuarios para paginación
        setTotalPages(data.totalPages);
        setPage(pageParam);
        setPageSize(sizeParam);
      } finally {
        endLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [logout, page, pageSize]
  );

  // Crear usuario y actualizar lista local
  const createUser = async (user) => {
    startLoading();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/create`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(user),
        }
      );

      handleUnauthorized(res);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear el usuario");
      }

      // Agregar el nuevo usuario a la lista local (al inicio)
      setUsers((prev) => [data.data, ...prev]);
      setTotalUsers((t) => t + 1);

      return data;
    } finally {
      endLoading();
    }
  };

  // Actualizar usuario y modificar estado local
  const updateUser = async (user) => {
    startLoading();
    const { _id, ...rest } = user;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${_id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(rest),
        }
      );

      handleUnauthorized(res);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar usuario");
      }

      // Actualizar usuario en la lista local
      setUsers((prev) =>
        prev.map((u) => (u._id === _id ? { ...u, ...rest } : u))
      );

      return data;
    } finally {
      endLoading();
    }
  };

  // Eliminar usuario y actualizar estado local
  const deleteUser = async (id) => {
    startLoading();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      handleUnauthorized(res);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar usuario");
      }

      // Eliminar usuario de la lista local
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotalUsers((t) => Math.max(t - 1, 0));

      return data;
    } finally {
      endLoading();
    }
  };

  // --- TIMBRADOS ---
  const getTimbrados = async () => {
    startLoading();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/timbrados`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
  
      handleUnauthorized(res);
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Error al obtener timbrados");
      }
  
      setTimbrados(data.data);
      return data.data; 
    } finally {
      endLoading();
    }
  };
  

  const createTimbrado = async (payload) => {
    startLoading();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timbrados`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      handleUnauthorized(res);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setTimbrados((prev) => [data.data, ...prev]);
      return data.data;
    } finally {
      endLoading();
    }
  };

  const getTimbradoById = async (id) => {
    startLoading();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/timbrados/${id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      handleUnauthorized(res);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al obtener timbrado");

      return data.data;
    } finally {
      endLoading();
    }
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        users,
        timbrados,
        page,
        pageSize,
        totalUsers,
        totalPages,
        setPage,
        setPageSize,
        getUsers,
        updateUser,
        createUser,
        deleteUser,
        // Timbrados
        getTimbrados,
        createTimbrado,
        getTimbradoById,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
