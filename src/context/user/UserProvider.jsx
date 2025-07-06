import React, { useState } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.log(data)
      setUsers(data.data);
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear el usuario");
      }

      console.log(data);

      return data;
    } catch (e) {
      console.error("Error en createUser:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user) => {
    const token = localStorage.getItem("AuthToken");
    setLoading(true);
    const { _id, ...rest } = user;
    console.log(rest)
    console.log("Enviando datos a updateUser:", rest);
  
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
  
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar usuario");
      }
  
      return data;
    } catch (e) {
      console.error("Error en updateUser:", e);
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

      if (!res.ok) {
        throw data;
      }

      return data;
    } catch (e) {
      console.error("Error en deleteUser:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        users,
        getUsers,
        updateUser,
        createUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
