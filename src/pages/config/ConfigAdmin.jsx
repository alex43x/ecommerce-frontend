import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useUser } from "../../context/user/UserContext";
import EditUser from "../../components/config/EditUser";
import ProductFormModal from "../../components/dashboard/products/ProductFormModal";
import NewUserForm from "../../components/config/NewUserForm";

import anadir from "../../images/anadir.png";
import editar from "../../images/editar.png";

export default function ConfigAdmin() {
  const [editUser, setEditUser] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { user } = useAuth();
  const { users, getUsers } = useUser();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="">
      <section className="flex gap-10 items-center mb-2">
        <h3 className="text-3xl font-medium">Administración de usuarios</h3>
        <button
          onClick={() => {
            setAddUser(true);
          }}
          className="bg-green-200 rounded text-green-800 flex gap-2 border border-green-800 hover:bg-green-300"
        >
          <p>Añadir Usuario</p>
          <img className="w-4 object-contain" src={anadir} alt="" />
        </button>
      </section>
      <div className="p-2 bg-neutral-200 rounded-lg w-10/12 mt-6">
        <table className="w-full">
          <thead className="border-b-2 border-neutral-100">
            <tr className="font-medium ">
              <td className="pb-2 pl-2">Id de Usuario</td>
              <td className="pb-2">Nombre</td>
              <td className="pb-2">Rol</td>
              <td className="pb-2">Estado</td>
              <td className="pb-2">Correo</td>
              <td className="pb-2">Opciones</td>
            </tr>
          </thead>
          <tbody>
            {users?.map((u, index) => (
              <tr key={index}>
                <td className="py-2 pl-2">{u._id}</td>
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2">
                  {u.active === "enable" ? (
                    <div className="px-2  text-green-800 bg-green-200 w-fit rounded-lg font-medium">
                      Activo
                    </div>
                  ) : (
                    <div className="px-2  text-red-800 bg-red-200 w-fit rounded-lg font-medium">
                      Inactivo
                    </div>
                  )}
                </td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  <button
                    className="bg-green-200 rounded flex justify-between gap-2 border border-green-800 hover:bg-green-300 text-green-800"
                    disabled={u.role === "admin" && u.name !== user.name}
                    onClick={() => {
                      setSelectedUser(u);
                      setEditUser(true);
                    }}
                  >
                    <p>Editar</p>
                    <img className="w-4 object-contain" src={editar} alt="" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {editUser && (
            <ProductFormModal
              isOpen={editUser}
              onClose={() => setEditUser(false)}
            >
              <EditUser onExit={() => setEditUser(false)} data={selectedUser} />
            </ProductFormModal>
          )}
          {addUser && (
            <ProductFormModal
              isOpen={addUser}
              onClose={() => setAddUser(false)}
            >
              <NewUserForm onExit={() => setAddUser(false)} />
            </ProductFormModal>
          )}
        </table>
      </div>
    </div>
  );
}
