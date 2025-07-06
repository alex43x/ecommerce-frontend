import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useUser } from "../../context/user/UserContext";
import EditUser from "../../components/config/EditUser";
import ProductFormModal from "../../components/dashboard/products/ProductFormModal";
import NewUserForm from "../../components/config/NewUserForm";

import anadir from "../../images/anadir.png";
import editar from "../../images/editar.png";

// Mapeo de roles a español
const ROLE_TRANSLATIONS = {
  spadmin: "Super Administrador",
  admin: "Administrador",
  cashier: "Cajero",
};

export default function ConfigAdmin() {
  const [editUser, setEditUser] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { users, getUsers } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Función para traducir el rol
  const translateRole = (role) => {
    return ROLE_TRANSLATIONS[role] || role;
  };

  return (
    <div className="p-4">
      <section className="flex gap-4 items-center justify-between mb-6 flex-wrap">
        <h3 className="text-2xl md:text-3xl font-medium text-green-800">
          Administración de usuarios
        </h3>
        <button
          onClick={() => setAddUser(true)}
          className="bg-green-200 rounded-lg text-green-800 flex gap-2 border border-green-800 hover:bg-green-300 px-4 py-2 transition-colors"
        >
          <p>Añadir Usuario</p>
          <img
            className="w-4 object-contain"
            src={anadir}
            alt="Añadir usuario"
          />
        </button>
      </section>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">Cargando usuarios...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-green-100">
              <tr className="text-left text-green-800">
                <th className="p-3">Nombre</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u._id} className="border-t border-neutral-200 bg-neutral-50 hover:bg-neutral-100">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{translateRole(u.role)}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded font-medium ${
                        u.active === "enable"
                          ? "bg-green-200 text-green-800 border border-green-800"
                          : "bg-red-200 text-red-800 border border-red-800"
                      }`}
                    >
                      {u.active === "enable" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <button
                      className={`flex items-center gap-2 px-3 py-1 rounded border transition-colors ${
                        (u.role === "admin" && user.role === "admin") ||
                        (u.role === "spadmin" && user.role === "admin")
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-200 text-green-800 border-green-800 hover:bg-green-300"
                      }`}
                      disabled={
                        (u.role === "admin" && user.role === "admin") ||
                        (u.role === "spadmin" && user.role === "admin")
                      }
                      onClick={() => {
                        setSelectedUser(u);
                        setEditUser(true);
                      }}
                      title={
                        u.role === "admin" && user.role === "admin"
                          ? "No puedes editar este administrador"
                          : "Editar usuario"
                      }
                    >
                      <span>Editar</span>
                      <img
                        className="w-3 object-contain"
                        src={editar}
                        alt="Editar"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modales */}
      {editUser && (
        <ProductFormModal isOpen={editUser} onClose={() => setEditUser(false)}>
          <EditUser
            onExit={() => setEditUser(false)}
            data={selectedUser}
            roleTranslations={ROLE_TRANSLATIONS}
          />
        </ProductFormModal>
      )}

      {addUser && (
        <ProductFormModal isOpen={addUser} onClose={() => setAddUser(false)}>
          <NewUserForm
            onExit={() => setAddUser(false)}
            roleTranslations={ROLE_TRANSLATIONS}
          />
        </ProductFormModal>
      )}
    </div>
  );
}
