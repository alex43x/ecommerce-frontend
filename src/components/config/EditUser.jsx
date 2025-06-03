import React, { useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "../../context/user/UserContext";
import cerrar from "../../images/eliminar.png";
import listo from "../../images/listo.png";

export default function EditUser({ data = {}, onExit = () => {} }) {
  const { getUsers, updateUser } = useUser();
  const [editData, setEditData] = useState({ ...data, password: "", confirmPassword: "" });
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
        text: e.message || "Intenta de nuevo",
      });
    }
  };

  return (
    <form className="w-[620px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-medium text-green-800">Editar Usuario</h3>
        <img onClick={onExit} className="w-4 object-contain" src={cerrar} alt="" />
      </div>

      <div className="flex gap-2 mb-2 w-full">
        <div className="w-7/12 pr-2">
          <section className="w-full flex gap-2">
            <label className="font-medium">Nombre:</label>
            <input
              type="text"
              name="name"
              className="w-full px-2"
              value={editData.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </section>
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>
        <div className="w-5/12">
          <section className="w-full flex gap-2">
            <label className="font-medium">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full px-2"
              value={editData.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </section>
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
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
        <div className="flex mb-2 w-full mt-3">
          <div className="w-6/12">
            <section className="w-full flex gap-1">
              <label className="font-medium">Contraseña:</label>
              <input
                type="password"
                name="password"
                className="px-1"
                value={editData.password}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </section>
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          </div>
          <div className="w-7/12">
            <section className="w-full flex gap-1">
              <label className="font-medium">Confirmar contraseña:</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-6/12 px-1"
                value={editData.confirmPassword}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </section>
            {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
          </div>
        </div>
      )}

      <section className="flex gap-2 my-2">
        <legend className="font-medium">Rol:</legend>
        <label>
          Admin
          <input
            type="radio"
            name="role"
            value="admin"
            className="ml-1"
            checked={editData.role === "admin"}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </label>
        <label>
          Cajero
          <input
            type="radio"
            name="role"
            value="cashier"
            className="ml-1"
            checked={editData.role === "cashier"}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </label>
        {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
      </section>

      <section className="flex gap-2 my-2">
        <legend className="font-medium">Usuario activo:</legend>
        <label>
          Sí
          <input
            type="radio"
            name="active"
            value="enable"
            className="ml-1"
            checked={editData.active === "enable"}
            onChange={(e) => handleChange("active", e.target.value)}
          />
        </label>
        <label>
          No
          <input
            type="radio"
            name="active"
            value="disable"
            className="ml-1"
            checked={editData.active === "disable"}
            onChange={(e) => handleChange("active", e.target.value)}
          />
        </label>
      </section>

      <div className="flex justify-center mt-4">
        <button
          className="font-medium text-green-800 bg-green-200 rounded border border-green-800 flex justify-between gap-2 items-center"
          type="button"
          onClick={handleSave}
        >
          <p>Guardar cambios</p>
          <img className="w-4 object-contain" src={listo} alt="" />
        </button>
      </div>
    </form>
  );
}
