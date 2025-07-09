import React, { useState } from "react";
import Swal from "sweetalert2";
import { CustomerContext } from "./CustomerContext";

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState({});
  const [customers, setCustomers] = useState([]);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("AuthToken");

  // Helper function para peticiones HTTP
  const fetchData = async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${url}`,
        options
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          `Error ${response.status}: ${response.statusText}`;

        // Mostrar error con Swal
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#3085d6",
        });

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en la petición:", error);
      setError(error.message);
      throw error; // Esto es importante para que el componente pueda capturar el error
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Crear nuevo cliente
  const createCustomer = async (customerData) => {
    try {
      const data = await fetchData("/api/customers", "POST", customerData);

      // Actualización CORRECTA del estado (sin .docs)
      setCustomers((prev) => {
        // Verificar si prev es un array (para compatibilidad hacia atrás)
        if (Array.isArray(prev)) {
          return [data, ...prev];
        }
        // Si prev es un objeto con paginación
        return {
          ...prev,
          docs: [data, ...(prev.docs || [])],
          total: (prev.total || 0) + 1,
        };
      });

      await Swal.fire({
        icon: "success",
        title: "Cliente creado",
        text: "El cliente se ha registrado correctamente",
        confirmButtonColor: "#3085d6",
      });

      return { success: true, data, isDuplicateError: false };
    } catch (error) {
      // Manejo específico para error de RUC duplicado
      if (
        error.message.includes("RUC") ||
        error.message.includes("duplicado") ||
        (error.response && error.response.status === 409)
      ) {
        return {
          success: false,
          error,
          isDuplicateError: true,
        };
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear el cliente",
        confirmButtonColor: "#3085d6",
      });

      return { success: false, error, isDuplicateError: false };
    }
  };

  // 🔸 Obtener lista de clientes con paginación
  const getCustomers = async (
    page = 1,
    limit = 10,
    search = "",
    active = null
  ) => {
    try {
      const params = new URLSearchParams({ page, limit });
      console.log(params, page, limit);
      if (search) params.append("search", search);
      if (active !== null) params.append("active", active);

      const data = await fetchData(`/api/customers?${params.toString()}`);
      setCustomers(data);
      return data;
    } catch (error) {
      // El error ya está manejado en fetchData
      return null;
    }
  };

  // 🔸 Obtener detalles de un cliente
  const getCustomerById = async (id) => {
    try {
      const data = await fetchData(`/api/customers/${id}`);
      setCustomerDetail(data);
      return data;
    } catch (error) {
      return null;
    }
  };

  // 🔸 Actualizar cliente existente
  const updateCustomer = async (id, customerData) => {
    try {
      const data = await fetchData(`/api/customers/${id}`, "PUT", customerData);

      // Actualizar lista de clientes
      setCustomers((prev) => ({
        ...prev,
        docs: prev.docs.map((c) => (c._id === id ? data : c)),
      }));

      // Actualizar detalle si es el mismo cliente
      if (customerDetail?._id === id) {
        setCustomerDetail(data);
      }

      return data;
    } catch (error) {
      return null;
    }
  };

  // 🔸 Cambiar estado activo/inactivo
  const toggleCustomerStatus = async (id) => {
    try {
      const data = await fetchData(
        `/api/customers/${id}/toggle-status`,
        "PATCH"
      );

      // Actualizar lista de clientes
      setCustomers((prev) => ({
        ...prev,
        docs: prev.docs.map((c) => (c._id === id ? data.customer : c)),
      }));

      // Actualizar detalle si es el mismo cliente
      if (customerDetail?._id === id) {
        setCustomerDetail(data.customer);
      }

      return data;
    } catch (error) {
      return null;
    }
  };

  // 🔸 Buscar clientes para autocompletar
  const searchCustomers = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return [];
    }

    try {
      const data = await fetchData(
        `/api/customers/search?term=${encodeURIComponent(term)}`
      );
      setSearchResults(data);
      return data;
    } catch (error) {
      setSearchResults([]);
      return [];
    }
  };
  const searchCustomerByRuc = async (ruc) => {
    try {
      const response = await fetch(
        `https://turuc.com.py/api/contribuyente?ruc=${ruc}`
      );

      if (!response.ok) {
        if (response.status === 400) {
          // Datos por defecto para Consumidor Final (Paraguay)
          const defaultCustomer = {
            doc: 0,
            razonSocial: "CONSUMIDOR FINAL",
            dv: 0,
            ruc: "44444401-7",
            estado: "ACTIVO",
            esPersonaJuridica: false,
            esEntidadPublica: false,
          };

          setCustomer(defaultCustomer);
          return [defaultCustomer];
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      if (result.data && result.data.ruc) {
        const customerData = {
          doc: result.data.doc,
          razonSocial: result.data.razonSocial,
          dv: result.data.dv,
          ruc: result.data.ruc,
          estado: result.data.estado,
          esPersonaJuridica: result.data.esPersonaJuridica,
          esEntidadPublica: result.data.esEntidadPublica,
        };

        setCustomer(customerData);
        return [customerData];
      } else {
        throw new Error("No se encontraron datos válidos en la respuesta");
      }
    } catch (error) {
      console.error("Error buscando contribuyente:", error);
      setCustomer(null);
      throw error;
    }
  };
  // 🔸 Limpiar resultados de búsqueda
  const clearSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        customerDetail,
        searchResults,
        loading,
        error,
        getCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        toggleCustomerStatus,
        searchCustomers,
        clearSearchResults,
        setCustomerDetail,
        searchCustomerByRuc,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
