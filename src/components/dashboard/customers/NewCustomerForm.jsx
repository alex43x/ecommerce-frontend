import React, { useState, useEffect } from "react";
import { useCustomer } from "../../../context/customer/CustomerContext";
import Swal from "sweetalert2";
import eliminar from "../../../images/eliminar.png";
import guardar from "../../../images/guardar.png";

export default function CustomerForm({ onExit = () => {}, customerData = null }) {
  const { createCustomer, updateCustomer, getCustomers } = useCustomer();
  const [customer, setCustomer] = useState({
    ruc: "",
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      neighborhood: "",
      reference: ""
    },
    isActive: true
  });

  const [errors, setErrors] = useState({
    ruc: "",
    name: "",
    email: "",
    phone: ""
  });

  const [submitting, setSubmitting] = useState(false);

  // Cargar datos del cliente si estamos en modo edición
  useEffect(() => {
    if (customerData) {
      setCustomer({
        ruc: customerData.ruc || "",
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
        address: {
          street: customerData.address?.street || "",
          city: customerData.address?.city || "",
          neighborhood: customerData.address?.neighborhood || "",
          reference: customerData.address?.reference || ""
        },
        isActive: customerData.isActive !== false
      });
    }
  }, [customerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    
    
    if (name === "name" && !value.trim()) {
      newErrors.name = "Nombre es obligatorio";
    } else if (name === "name") {
      newErrors.name = "";
    }
    
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = "Email no válido";
    } else if (name === "email") {
      newErrors.email = "";
    }
    
    if (name === "phone" && value && !/^[0-9\s+-]{6,20}$/.test(value)) {
      newErrors.phone = "Teléfono no válido";
    } else if (name === "phone") {
      newErrors.phone = "";
    }
    
    setErrors(newErrors);
    
    // Actualizar estado
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setCustomer(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setCustomer(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStatusChange = () => {
    setCustomer(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validación final antes de enviar
    if (!customer.ruc || !customer.name) {
      setErrors(prev => ({
        ...prev,
        ruc: !customer.ruc ? "RUC es obligatorio" : "",
        name: !customer.name ? "Nombre es obligatorio" : ""
      }));
      
      // Toast de error para validación
      Swal.fire({
        icon: "error",
        title: "Campos requeridos",
        text: "RUC y Nombre son obligatorios",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      setSubmitting(false);
      return;
    }
    
    try {
      if (customerData) {
        // Modo edición
        const result = await updateCustomer(customerData._id, customer);
        if (result) {
          // Actualizar lista de clientes y cerrar
          await getCustomers(1, 10, '', true);
          onExit();
        }
      } else {
        // Modo creación
        const result = await createCustomer(customer);
        if (result.success) {
          // Actualizar lista de clientes y cerrar
          await getCustomers(1, 10, '', true);
          onExit();
        } else if (result.isDuplicateError) {
          // Mostrar error específico en el campo RUC
          setErrors(prev => ({
            ...prev,
            ruc: "Este RUC ya está registrado"
          }));
          
          // Enfocar el campo RUC
          setTimeout(() => {
            const rucInput = document.querySelector('input[name="ruc"]');
            if (rucInput) rucInput.focus();
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Función para renderizar asterisco rojo en campos obligatorios
  const RequiredAsterisk = () => <span className="text-red-600">*</span>;

  return (
    <div className="relative">
      {/* Botón de cerrar en esquina superior derecha */}
      <button
        type="button"
        onClick={onExit}
        className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full"
      >
        <img className="w-5 h-5 object-contain" src={eliminar} alt="Cerrar" />
      </button>

      <form className="flex flex-col md:flex-row gap-4 p-2 pt-10" onSubmit={handleSubmit}>
        {/* Sección izquierda - Datos principales */}
        <div className="w-full md:w-1/2 px-2">
          <h1 className="text-green-800 text-xl font-bold mb-4">
            {customerData ? "Editar Cliente" : "Registrar Cliente"}
          </h1>

          {/* RUC */}
          <label className="w-full my-2 font-medium">
            RUC: <RequiredAsterisk />
            <input
              type="text"
              name="ruc"
              className={`bg-white w-full px-3 py-1 rounded border ${
                errors.ruc ? "border-red-500" : "border-gray-300"
              }`}
              value={customer.ruc}
              onChange={handleChange}
              required
              maxLength={15}
              min={0}
              disabled={customerData} // Deshabilitar en modo edición
            />
            {errors.ruc && <span className="text-red-600 text-sm">{errors.ruc}</span>}
          </label>

          {/* Nombre */}
          <label className="w-full my-2 font-medium">
            Nombre: <RequiredAsterisk />
            <input
              type="text"
              name="name"
              className={`bg-white w-full px-3 py-1 rounded border ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={customer.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
          </label>

          {/* Email */}
          <label className="w-full my-2 font-medium">
            Email:
            <input
              type="email"
              name="email"
              className={`bg-white w-full px-3 py-1 rounded border ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={customer.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
          </label>

          {/* Teléfono */}
          <label className="w-full my-2 font-medium">
            Teléfono:
            <input
              type="text"
              name="phone"
              className={`bg-white w-full px-3 py-1 rounded border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              value={customer.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="text-red-600 text-sm">{errors.phone}</span>}
          </label>

          {/* Estado */}
          <div className="flex items-center gap-2 my-4">
            <label className="font-medium">Estado:</label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={customer.isActive}
                onChange={handleStatusChange}
                className="sr-only"
              />
              <label
                htmlFor="isActive"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  customer.isActive ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform ${
                    customer.isActive ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </label>
            </div>
            <span>{customer.isActive ? "Activo" : "Inactivo"}</span>
          </div>
        </div>

        {/* Sección derecha - Dirección */}
        <div className="w-full md:w-1/2 px-2">
          <h2 className="text-green-800 text-lg font-bold mb-4">Dirección</h2>

          {/* Calle */}
          <label className="w-full my-2 font-medium">
            Calle:
            <input
              type="text"
              name="address.street"
              className="bg-white w-full px-3 py-1 rounded border border-gray-300"
              value={customer.address.street}
              onChange={handleChange}
            />
          </label>

          {/* Ciudad */}
          <label className="w-full my-2 font-medium">
            Ciudad:
            <input
              type="text"
              name="address.city"
              className="bg-white w-full px-3 py-1 rounded border border-gray-300"
              value={customer.address.city}
              onChange={handleChange}
            />
          </label>

          {/* Barrio */}
          <label className="w-full my-2 font-medium">
            Barrio:
            <input
              type="text"
              name="address.neighborhood"
              className="bg-white w-full px-3 py-1 rounded border border-gray-300"
              value={customer.address.neighborhood}
              onChange={handleChange}
            />
          </label>

          {/* Referencia */}
          <label className="w-full my-2 font-medium">
            Referencia:
            <textarea
              name="address.reference"
              className="bg-white w-full px-3 py-1 rounded border border-gray-300"
              value={customer.address.reference}
              onChange={handleChange}
              rows={3}
            />
          </label>

          {/* Botón de guardar */}
          <button
            type="submit"
            disabled={submitting}
            className={`bg-green-200 text-green-950 rounded px-4 py-2 flex items-center justify-center gap-2 w-full mt-6 hover:bg-green-300 transition-colors ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img className="w-5 h-5 object-contain" src={guardar} alt="Guardar" />
            <span>
              {submitting
                ? "Procesando..."
                : customerData
                ? "Actualizar Cliente"
                : "Registrar Cliente"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}