import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useUser } from "../../context/user/UserContext";
import EditUser from "../../components/config/EditUser";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import NewUserForm from "../../components/config/NewUserForm";

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
    <div>
      <h1>Detalles del usuario</h1>

      <p>Nombre: {user.name}</p>
      <p>Rol: {user.role}</p>

      <button
        onClick={() => {
          setAddUser(true);
        }}
      >
        Añadir➕
      </button>
      
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Nombre</td>
            <td>Rol</td>
            <td>Correo</td>
            <td>Opciones</td>
          </tr>
        </thead>
        <tbody>
          {users?.map((u, index) => (
            <tr key={index}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td>
                <button
                  disabled={u.role==="admin" && u.name!==user.name}
                  onClick={() => {
                    setSelectedUser(u);
                    setEditUser(true);
                  }}
                >
                  🖋️
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
          <ProductFormModal isOpen={addUser} onClose={() => setAddUser(false)}>
            <NewUserForm onExit={() => setAddUser(false)} />
          </ProductFormModal>
        )}
      </table>
    </div>
  );
}
