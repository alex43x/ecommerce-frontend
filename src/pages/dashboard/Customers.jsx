import { useEffect, useState } from "react";
import { useCustomer } from "../../context/customer/CustomerContext";
import CustomerForm from "../../components/dashboard/customers/NewCustomerForm";

export default function Customers() {
  const {
    customers,
    getCustomers,
    toggleCustomerStatus,
    searchCustomers,
    searchResults,
    clearSearchResults,
  } = useCustomer();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    active: null,
    sortBy: "dateDesc",
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Cargar clientes cuando cambien filtros
  useEffect(() => {
    getCustomers(
      filters.page,
      filters.limit,
      filters.search,
      filters.active,
      filters.sortBy
    );
  }, [filters]);

  // Manejo de entrada de búsqueda
  const handleSearch = (value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));

    if (value.trim()) {
      searchCustomers(value);
    } else {
      clearSearchResults();
    }
  };

  // Cambiar estado (activo/inactivo)
  const handleToggleStatus = async (id) => {
    await toggleCustomerStatus(id);
  };

  return (
    <div className="p-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4 items-center ">
        <input
          type="text"
          placeholder="Buscar por nombre, RUC o email"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          className="border p-2 rounded"
          value={filters.active ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              page: 1,
              active: e.target.value === "" ? null : e.target.value === "true",
            }))
          }
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              page: 1,
              sortBy: e.target.value,
            }))
          }
        >
          <option value="dateDesc">Más recientes</option>
          <option value="dateAsc">Más antiguos</option>
          <option value="nameAsc">Nombre A-Z</option>
          <option value="nameDesc">Nombre Z-A</option>
        </select>
        {/* Botón Nuevo Cliente */}
        <div className="mb-4">
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setShowForm(true);
            }}
            className="bg-green-200 text-green-800 border border-green-800 px-3 py-1 rounded hover:bg-green-300"
          >
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Tabla con scroll horizontal */}
      <div className="overflow-x-auto rounded-lg border shadow-md">
        <table className="min-w-[900px] w-full text-left">
          <thead className="bg-neutral-200 text-green-800">
            <tr>
              <th className="p-3">RUC</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center w-32">Acciones</th>
              <th className="p-3 text-center w-32">Editar</th>
            </tr>
          </thead>

          <tbody>
            {customers.docs?.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              customers.docs.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{c.ruc}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email || "-"}</td>
                  <td className="p-3">{c.phone || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        c.isActive
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {c.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(c._id)}
                      className={`px-3 py-1 rounded  ${
                        c.isActive
                          ? "bg-red-200 text-red-800 border border-red-800"
                          : "bg-green-200 text-green-800 border border-green-800"
                      }`}
                    >
                      {c.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedCustomer(c);
                        setShowForm(true);
                      }}
                      className="bg-green-200 text-green-800 px-3 py-1 rounded hover:bg-green-800 border border-green-800"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={filters.page <= 1}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        >
          Anterior
        </button>

        <span>
          Página <strong>{customers.page}</strong> de{" "}
          <strong>{customers.totalPages}</strong>
        </span>

        <button
          disabled={filters.page >= customers.totalPages}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* Modal para formulario de cliente */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-4 max-h-[95vh] overflow-y-auto w-[95%] md:w-[70%] lg:w-[50%]">
            <CustomerForm
              customerData={selectedCustomer}
              onExit={() => {
                setShowForm(false);
                setSelectedCustomer(null);
                getCustomers(
                  filters.page,
                  filters.limit,
                  filters.search,
                  filters.active,
                  filters.sortBy
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
