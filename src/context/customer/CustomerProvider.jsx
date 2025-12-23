import React, { useState } from "react";
import Swal from "sweetalert2";
import { CustomerContext } from "./CustomerContext";

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState({});
  const [customers, setCustomers] = useState({
    docs: [],
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  });

  const [customerDetail, setCustomerDetail] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("AuthToken");

  // ------------------------------------------------------------
  // 🔷 Helper: Peticiones HTTP
  // ------------------------------------------------------------
  const fetchData = async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);
    console.log("fetchData called with:", { url, method, body });
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (body) options.body = JSON.stringify(body);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${url}`,
        options
      );
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          `Error ${response.status}: ${response.statusText}`;

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en la petición:", error);
      //setError(error.message);
      //throw error;
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🔷 Crear cliente
  // ------------------------------------------------------------
  const createCustomer = async (customerData) => {
    try {
      const data = await fetchData("/api/customers", "POST", customerData);

      setCustomers((prev) => ({
        ...prev,
        docs: [data, ...(prev.docs || [])],
        total: prev.total + 1,
      }));

      await Swal.fire({
        icon: "success",
        title: "Cliente creado",
        text: "El cliente se ha registrado correctamente",
        confirmButtonColor: "#3085d6",
      });

      return { success: true, data, isDuplicateError: false };
    } catch (error) {
      if (
        error.message.includes("RUC") ||
        error.message.includes("duplicado")
      ) {
        return { success: false, error, isDuplicateError: true };
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

  // ------------------------------------------------------------
  // 🔷 Obtener clientes (LISTA COMPLETA CON FILTROS + PAGINACIÓN)
  // ------------------------------------------------------------
  const getCustomers = async (
    page = 1,
    limit = 10,
    search = "",
    active = null,
    sortBy = "dateDesc"
  ) => {
    try {
      const params = new URLSearchParams({ page, limit, sortBy });

      if (search) params.append("search", search);
      if (active !== null) params.append("active", active);

      const data = await fetchData(`/api/customers?${params.toString()}`);

      const adapted = {
        docs: data.customers,
        total: data.totalCustomers,
        totalPages: data.totalPages,
        page: data.currentPage,
        limit: data.limit,
      };

      setCustomers(adapted);
      return adapted;
    } catch (error) {
      return null;
    }
  };

  // ------------------------------------------------------------
  // 🔷 Obtener un cliente por ID
  // ------------------------------------------------------------
  const getCustomerById = async (id) => {
    try {
      const data = await fetchData(`/api/customers/${id}`);
      setCustomerDetail(data);
      return data;
    } catch (error) {
      return null;
    }
  };

  // ------------------------------------------------------------
  // 🔷 Actualizar cliente
  // ------------------------------------------------------------
  const updateCustomer = async (id, customerData) => {
    try {
      const data = await fetchData(`/api/customers/${id}`, "PUT", customerData);

      setCustomers((prev) => ({
        ...prev,
        docs: prev.docs.map((c) => (c._id === id ? data : c)),
      }));

      if (customerDetail?._id === id) {
        setCustomerDetail(data);
      }

      return data;
    } catch (error) {
      return null;
    }
  };

  // ------------------------------------------------------------
  // 🔷 Activar / Desactivar cliente
  // ------------------------------------------------------------
  const toggleCustomerStatus = async (id) => {
    try {
      const data = await fetchData(
        `/api/customers/${id}/toggle-status`,
        "PATCH"
      );

      setCustomers((prev) => ({
        ...prev,
        docs: prev.docs.map((c) => (c._id === id ? data.customer : c)),
      }));

      if (customerDetail?._id === id) {
        setCustomerDetail(data.customer);
      }

      return data;
    } catch (error) {
      return null;
    }
  };

  // ------------------------------------------------------------
  // 🔷 Búsqueda rápida (autocompletar)
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  //  Busca cliente por RUC (1° local DB → 2° API externa)
  // ------------------------------------------------------------
  const searchCustomerByRuc = async (ruc) => {
    const defaultCustomer = {
      doc: 0,
      razonSocial: "CONSUMIDOR FINAL",
      dv: 0,
      ruc: "44444401-7",
      estado: "ACTIVO",
      esPersonaJuridica: false,
      esEntidadPublica: false,
    };

    // -------------------------------
    //  BUSCAR EN TU API INTERNA POR RUC
    // -------------------------------
    try {
      const local = await fetchData(`/api/customers/ruc/${ruc}`);

      if (local && local.ruc) {
        const converted = {
          doc: local.ruc,
          razonSocial: local.name,
          dv: local.dv ?? 0,
          ruc: local.ruc,
          estado: local.isActive ? "ACTIVO" : "INACTIVO",
          esPersonaJuridica: false,
          esEntidadPublica: false,
        };

        setCustomer(converted);
        return [converted];
      }
    } catch (err) {
      // no existe → seguir
    }

    // -------------------------------
    //  BUSCAR EN API EXTERNA
    // -------------------------------
    try {
      const response = await fetch(
        `https://turuc.com.py/api/contribuyente?ruc=${ruc}`
      );

      if (!response.ok) {
        setCustomer(defaultCustomer);
        return [defaultCustomer];
      }

      const result = await response.json();

      if (result?.data?.ruc) {
        const data = {
          doc: result.data.doc,
          razonSocial: result.data.razonSocial,
          dv: result.data.dv,
          ruc: result.data.ruc,
          estado: result.data.estado,
          esPersonaJuridica: result.data.esPersonaJuridica,
          esEntidadPublica: result.data.esEntidadPublica,
        };
        console.log("Cliente externo encontrado:", data);
        setCustomer(data);

        // -------------------------------
        //  GUARDAR SOLO RUC Y NAME EN BD
        // -------------------------------
        try {
          await fetchData("/api/customers", "POST", {
            ruc: data.ruc,
            name: data.razonSocial,
          });
        } catch (saveError) {
          // No pasa nada si ya existe (409)
          console.warn("No se pudo guardar el cliente externo:", saveError);
        }

        return [data];
      }
    } catch (error) {
      console.error("Error al consultar API externa:", error);
    }

    // -------------------------------
    // 4️⃣ SI TODO FALLA → CONSUMIDOR FINAL
    // -------------------------------
    setCustomer(defaultCustomer);
    return [defaultCustomer];
  };

  // ------------------------------------------------------------
  // 🔷 Limpiar búsqueda
  // ------------------------------------------------------------
  const clearSearchResults = () => {
    setSearchResults([]);
  };

  // ------------------------------------------------------------
  // 🔷 Retornar Provider
  // ------------------------------------------------------------
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
        searchCustomerByRuc,
        setCustomerDetail,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
