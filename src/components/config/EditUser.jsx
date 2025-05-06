import React, { useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "../../context/user/UserContext";

export default function EditUser({ data = {}, onExit = () => {} }) {
  const { getUsers, updateUser } = useUser();
  const [editData, setEditData] = useState({ ...data, password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setEditData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!editData.email.trim()) newErrors.email = "El email es obligatorio";
    if (editData.password && editData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (editData.password && editData.password !== editData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!editData.role) newErrors.role = "Selecciona un rol";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const dataToSend = { ...editData };
      console.log("Data to send:", dataToSend);

      if (!editData.password) delete dataToSend.password;
      delete dataToSend.confirmPassword;

      await updateUser(dataToSend);

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        timer: 1500,
        showConfirmButton: false,
      });
      onExit();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: e.message || "Intenta de nuevo",
      });
    }
    try{
        await getUsers();
    }catch(e){
        console.error(e)
    }
  };

  return (
    <form>
      <label>
        Nombre:
        <input
          name="name"
          type="text"
          value={editData.name}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </label>
      <label>
        Correo:
        <input
          name="email"
          type="email"
          value={editData.email}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </label>
      <label>
        Nueva contraseña:
        <input
          type="password"
          name="password"
          value={editData.password}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </label>

      <label>
        Confirmar contraseña:
        <input
          type="password"
          name="confirmPassword"
          value={editData.confirmPassword}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword}</p>
        )}
      </label>

      <fieldset>
        <legend>Roles</legend>
        <label>
          Admin
          <input
            type="radio"
            name="role"
            value="admin"
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
            checked={editData.role === "cashier"}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </label>
        {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
      </fieldset>
      <fieldset>
        <legend>Usuario Activo</legend>
        <label>
          Si
          <input
            type="radio"
            name="active"
            value="enable"
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
            checked={editData.active === "disable"}
            onChange={(e) => handleChange("active", e.target.value)}
          />
        </label>
        {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
      </fieldset>
      <button type="button" onClick={handleSave}>
        ✅
      </button>
      <button type="button" onClick={onExit}>
        ❎
      </button>
    </form>
  );
}
