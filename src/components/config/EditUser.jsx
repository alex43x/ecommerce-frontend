import React, { useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "../../context/user/UserContext";
import cerrar from "../../images/eliminar.png";
import listo from "../../images/listo.png";

export default function EditUser({ data = {}, onExit = () => {} }) {
  const { getUsers, updateUser } = useUser();
  const [editData, setEditData] = useState({
    ...data,
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [changePassword, setChangePassword] = useState(false);

  const handleChange = (name, value) => {
    setEditData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!editData.email.trim()) newErrors.email = "El email es obligatorio";
    if (changePassword) {
      if (!editData.password || editData.password.length < 6)
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      if (editData.password !== editData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!editData.role) newErrors.role = "Selecciona un rol";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Formulario inválido",
        text: "Revisa los campos",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const dataToSend = { ...editData };
      if (!changePassword || !editData.password) delete dataToSend.password;
      delete dataToSend.confirmPassword;

      await updateUser(dataToSend);

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        timer: 1500,
        showConfirmButton: false,
      });
      onExit();
      await getUsers();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: e?.message || "Intenta de nuevo",
      });
    }
  };

  return (
    <form className="w-[690px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-medium text-green-800">Editar Usuario</h3>
        <img
          onClick={onExit}
          className="w-4 object-contain cursor-pointer"
          src={cerrar}
          alt="Cerrar"
        />
      </div>

      <div className="flex gap-2 mb-2 w-full items-center">
        <div className="w-7/12 pr-2">
          <section className=" flex gap-2 items-center">
            <label className="font-medium">Nombre:</label>
            <input
              type="text"
              name="name"
              className="px-2 py-1 mr-2 border border-neutral-400 rounded w-full"
              value={editData.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </section>
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>
        <div className="w-5/12">
          <section className="w-full flex gap-2 items-center">
            <label className="font-medium">Email:</label>
            <input
              type="email"
              name="email"
              className="px-2 py-1 mr-2 border border-neutral-400 rounded"
              value={editData.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </section>
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={changePassword}
          onChange={(e) => setChangePassword(e.target.checked)}
        />
        <label className="text-sm">Cambiar contraseña</label>
      </div>

      {changePassword && (
        <div className="flex mb-2 w-full mt-3 items-center">
          <div className="w-6/12">
            <section className="w-full flex gap-1 items-center">
              <label className="font-medium">Contraseña:</label>
              <input
                type="password"
                name="password"
                className="px-2 py-1 mr-2 border border-neutral-400 rounded"
                value={editData.password}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </section>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="w-7/12">
            <section className="w-full flex gap-1 items-center">
              <label className="font-medium">Confirmar contraseña:</label>
              <input
                type="password"
                name="confirmPassword"
                className="px-2 py-1 mr-2 border border-neutral-400 rounded"
                value={editData.confirmPassword}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </section>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      )}

      {data.role !== "spadmin" && (
        <>
          <section className="flex gap-4 my-2">
            <label className="font-medium">Rol:</label>
            <label className="flex items-center gap-1">
              Admin
              <input
                type="radio"
                name="role"
                value="admin"
                checked={editData.role === "admin"}
                onChange={(e) => handleChange("role", e.target.value)}
              />
            </label>
            <label className="flex items-center gap-1">
              Cajero
              <input
                type="radio"
                name="role"
                value="cashier"
                checked={editData.role === "cashier"}
                onChange={(e) => handleChange("role", e.target.value)}
              />
            </label>
            {errors.role && (
              <p className="text-red-600 text-sm">{errors.role}</p>
            )}
          </section>

          <section className="flex gap-4 my-2">
            <label className="font-medium">Usuario activo:</label>
            <label className="flex items-center gap-1">
              Sí
              <input
                type="radio"
                name="active"
                value="enable"
                checked={editData.active === "enable"}
                onChange={(e) => handleChange("active", e.target.value)}
              />
            </label>
            <label className="flex items-center gap-1">
              No
              <input
                type="radio"
                name="active"
                value="disable"
                checked={editData.active === "disable"}
                onChange={(e) => handleChange("active", e.target.value)}
              />
            </label>
          </section>
        </>
      )}

      <div className="flex justify-center mt-4">
        <button
          className="font-medium text-green-800 bg-green-200 rounded border border-green-800 flex justify-between gap-2 items-center px-4 py-2 hover:bg-green-300 transition-colors"
          type="button"
          onClick={handleSave}
        >
          <p>Guardar cambios</p>
          <img className="w-4 object-contain" src={listo} alt="Guardar" />
        </button>
      </div>
    </form>
  );
}
