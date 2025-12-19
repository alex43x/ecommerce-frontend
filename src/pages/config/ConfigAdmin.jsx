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
  spadmin: "Administrador General",
  admin: "Administrador",
  cashier: "Cajero",
};

export default function ConfigAdmin() {
  const [editUser, setEditUser] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTimbradoModal, setShowTimbradoModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    issuedAt: "",
    expiresAt: "",
    establishment: "001",
    branch: "001",
    maxInvoices: 999999
  });
  const [loadingTimbrado, setLoadingTimbrado] = useState(false);
  const [activeTimbrado, setActiveTimbrado] = useState(null);

  const { user } = useAuth();
  const { users, getUsers, page, totalPages, loading, timbrados, getTimbrados, createTimbrado } = useUser();

  useEffect(() => {
    getUsers();
    fetchTimbrados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTimbrados = async () => {
    try {
      const data = await getTimbrados(); // ← datos reales
      const now = new Date();
  
      const active = data.find(
        (t) =>
          new Date(t.issuedAt) <= now &&
          new Date(t.expiresAt) >= now
      );
  
      setActiveTimbrado(active || null);
    } catch (err) {
      console.error("Error obteniendo timbrados:", err);
    }
  };
  

  const translateRole = (role) => {
    return ROLE_TRANSLATIONS[role] || role;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTimbrado = async (e) => {
    e.preventDefault();
    setLoadingTimbrado(true);
  
    try {
      const payload = {
        code: formData.code,
        issuedAt: new Date(formData.issuedAt).toISOString(),
        expiresAt: new Date(formData.expiresAt).toISOString(),
      };
  
      await createTimbrado(payload);
      setShowTimbradoModal(false);
      fetchTimbrados();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingTimbrado(false);
    }
  };
  

  return (
    <div className="p-4">
      {/* Sección Usuarios */}
      <section className="flex gap-4 items-center justify-between mb-6 flex-wrap">
        <h3 className="text-2xl md:text-3xl font-medium text-green-800">
          Administración de usuarios
        </h3>
        <button
          onClick={() => setAddUser(true)}
          className="bg-green-200 rounded-lg text-green-800 flex gap-2 border border-green-800 hover:bg-green-300 px-4 py-2 transition-colors"
        >
          <p>Añadir Usuario</p>
          <img className="w-4 object-contain" src={anadir} alt="Añadir usuario" />
        </button>
      </section>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-6">
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                  >
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
                          ((u.role === "admin" && user.role === "admin") && user.name!==u.name) ||
                          (u.role === "spadmin" && user.role === "admin")
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-green-200 text-green-800 border-green-800 hover:bg-green-300"
                        }`}
                        disabled={
                          ((u.role === "admin" && user.role === "admin") && user.name!==u.name) ||
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
                        <img className="w-3 object-contain" src={editar} alt="Editar" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación Usuarios */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => getUsers(page - 1)}
            className="px-3 py-1 rounded border border-green-800 text-green-800 bg-green-200 hover:bg-green-300 disabled:opacity-50"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => getUsers(p)}
              className={`px-3 py-1 rounded border ${
                page === p
                  ? "bg-green-200 text-green-800 border border-green-800"
                  : "bg-white text-green-800 hover:bg-green-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => getUsers(page + 1)}
            className="px-3 py-1 rounded border border-green-800 text-green-800 bg-green-200 hover:bg-green-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Sección Timbrado */}
      <section className="mt-8">
        <h3 className="text-2xl md:text-3xl font-medium text-green-800 mb-4">
          Timbrados
        </h3>

        {!activeTimbrado && (
          <button
            onClick={() => setShowTimbradoModal(true)}
            className="bg-green-200 text-green-800 px-4 py-2 rounded-lg border border-green-800 hover:bg-green-300 flex gap-2"
          >
            Cargar Timbrado
          </button>
        )}

        {activeTimbrado && (
          <div className="mt-4 p-4 bg-green-100 border border-green-800 rounded-lg text-green-800">
            <p><strong>Número:</strong> {activeTimbrado.code}</p>
            <p><strong>Inicio vigencia:</strong> {new Date(activeTimbrado.issuedAt).toLocaleDateString()}</p>
            <p><strong>Fin vigencia:</strong> {new Date(activeTimbrado.expiresAt).toLocaleDateString()}</p>
            <p><strong>Establecimiento:</strong> {activeTimbrado.establishment}</p>
            <p><strong>Sucursal:</strong> {activeTimbrado.branch}</p>
            <p><strong>Máx. facturas:</strong> {activeTimbrado.maxInvoices}</p>
          </div>
        )}

        {showTimbradoModal && (
          <ProductFormModal isOpen={showTimbradoModal} onClose={() => setShowTimbradoModal(false)}>
            <form onSubmit={handleSubmitTimbrado} className="flex flex-col gap-4">
              <label className="flex flex-col text-green-800">
                Número de timbrado
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="border border-green-800 rounded px-2 py-1 mt-1"
                  required
                />
              </label>

              <label className="flex flex-col text-green-800">
                Fecha inicio vigencia
                <input
                  type="date"
                  name="issuedAt"
                  value={formData.issuedAt}
                  onChange={handleChange}
                  className="border border-green-800 rounded px-2 py-1 mt-1"
                  required
                />
              </label>

              <label className="flex flex-col text-green-800">
                Fecha fin vigencia
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="border border-green-800 rounded px-2 py-1 mt-1"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loadingTimbrado}
                className={`px-4 py-2 rounded-lg border border-green-800 transition-colors ${
                  loadingTimbrado ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-200 text-green-800 hover:bg-green-300"
                }`}
              >
                {loadingTimbrado ? "Cargando..." : "Guardar Timbrado"}
              </button>
            </form>
          </ProductFormModal>
        )}
      </section>

      {/* Modales Usuarios */}
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
