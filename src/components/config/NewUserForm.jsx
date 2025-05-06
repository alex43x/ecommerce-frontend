import React, { useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "../../context/user/UserContext";

export default function NewUserForm({ onExit = () => {} }) {
  const { createUser, getUsers } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!formData.role) newErrors.role = "Selecciona un rol";

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
      const newUser = { ...formData };
      delete newUser.confirmPassword;

      await createUser(newUser);

      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        timer: 1500,
        showConfirmButton: false,
      });

      onExit();
      await getUsers();
    } catch (e) {
      const msg =
        e?.message ||
        e?.errors?.email?.message || // ejemplo: correo ya registrado
        "Intenta de nuevo";

      Swal.fire({
        icon: "error",
        title: "Error al crear",
        text: msg,
      });
    }
  };

  return (
    <form>
      <label>
        Nombre:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </label>

      <label>
        Contraseña:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </label>

      <label>
        Confirmar contraseña:
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
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
            checked={formData.role === "admin"}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </label>
        <label>
          Cajero
          <input
            type="radio"
            name="role"
            value="cashier"
            checked={formData.role === "cashier"}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </label>
        {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
      </fieldset>

      <button type="button" onClick={handleSave}>
        Crear usuario ✅
      </button>
      <button type="button" onClick={onExit}>
        Cancelar ❎
      </button>
    </form>
  );
}
