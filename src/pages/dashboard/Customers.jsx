import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useCustomer } from "../../context/customer/CustomerContext";
import CustomerTable from "../../components/dashboard/customers/CustomerTable";

import NewCustomerForm from "../../components/dashboard/customers/NewCustomerForm";

import anadir from "../../images/anadir.png";
import az from "../../images/a-z.png";
import za from "../../images/z-a.png";
import calendario from "../../images/calendario.png";

export default function Customers() {
  const {
    getCustomers,
    updateCustomer,
    deactivateCustomer,
    loading,
    customers,
  } = useCustomer();

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    sortBy: "dateDesc",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [addCustomer, setAddCustomer] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getCustomers({ ...filters, limit: 15 }).then((res) => {
      setTotalPages(res.totalPages || 1);
    });
  }, [filters]);

  useEffect(() => {
    const delayedSearch = debounce(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchInput]);
  useEffect(() => {
    console.log(customers);
  }, [customers]);

  const sortOptions = [
    { label: "Más reciente", value: "dateDesc", icon: calendario },
    { label: "Más antiguo", value: "dateAsc", icon: calendario },
    { label: "A-Z", value: "nameAsc", icon: az },
    { label: "Z-A", value: "nameDesc", icon: za },
  ];

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <h3 className="text-green-800 text-xl">Buscar:</h3>
          <input
            type="text"
            className="border-2 px-2 py-1 rounded-lg bg-neutral-50"
            placeholder="Buscar cliente..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          {/* Ordenamiento */}
          <select
            className="border px-2 py-1 rounded-md bg-neutral-50"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sortBy: e.target.value, page: 1 }))
            }
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Agregar cliente */}
        <div className="flex gap-2 items-center">
          <h3 className="text-green-800 text-xl">Nuevo:</h3>
          <button
            className="bg-green-200 border border-green-800 text-green-800 px-2 py-1 flex gap-2 hover:bg-green-300 transition"
            onClick={() => setAddCustomer(true)}
          >
            <p>Agregar Cliente</p>
            <img className="w-5 object-contain" src={anadir} alt="" />
          </button>
          {addCustomer && (
            <div className="fixed inset-0 backdrop-blur-xs bg-[#00000043] flex items-center justify-center z-50">
              <div className="bg-neutral-100 rounded-lg p-4 w-[710px]  max-w-3xl max-h-[90vh] overflow-y-auto">
                <NewCustomerForm onExit={() => setAddCustomer(false)} customerData={selectedCustomer} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      {customers.customers?.length > 0 ? (
        <>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg">
            <CustomerTable
              customers={customers.customers}
              loading={loading}
              onDeactivate={deactivateCustomer}
            />
          </div>

          <div className="flex justify-center mt-4 gap-4 items-center">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              className="bg-green-200 border border-green-800 text-green-800"
            >
              Anterior
            </button>
            <span className="text-green-800 font-medium">
              Página {filters.page} de {totalPages}
            </span>
            <button
              disabled={filters.page === totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              className="bg-green-200 border border-green-800 text-green-800"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-center font-medium text-neutral-600 text-3xl mt-16">
          No se encontraron clientes con esos filtros.
        </p>
      )}
    </div>
  );
}
