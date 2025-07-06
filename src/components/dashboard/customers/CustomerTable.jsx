import React from "react";
import Swal from "sweetalert2";

export default function CustomerTable({ customers = [], onDeactivate, onEdit }) {
  const handleDeactivate = async (customerId) => {
    const result = await Swal.fire({
      title: "¿Desactivar cliente?",
      text: "Esta acción ocultará al cliente del sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    onDeactivate(customerId);

    Swal.fire(
      "Desactivado",
      "El cliente fue desactivado correctamente.",
      "success"
    );
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (!customers.length) {
    return (
      <p className="text-center font-medium text-neutral-600 text-3xl mt-8">
        No se encontraron clientes.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="max-h-[500px] overflow-y-auto rounded-lg">
        <table className="w-full mt-2">
          <thead className="sticky top-0 bg-neutral-200 z-10">
            <tr className="border-b-2 border-neutral-300">
              <th className="text-left text-green-800 font-medium text-md pl-2">
                RUC
              </th>
              <th className="text-left text-green-800 font-medium text-md">
                Nombre
              </th>
              <th className="text-left text-green-800 font-medium text-md">
                Email
              </th>
              <th className="text-left text-green-800 font-medium text-md">
                Teléfono
              </th>
              <th className="text-left text-green-800 font-medium text-md">
                Dirección
              </th>
              <th className="text-left text-green-800 font-medium text-md">
                Estado
              </th>
              <th className="text-left text-green-800 font-medium text-md">
                Registrado
              </th>
              <th className="text-green-800 font-medium text-md">Acción</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer._id}
                className="border-b-2 border-neutral-300 hover:bg-neutral-200 transition"
              >
                <td className="py-2 pl-2 font-medium">{customer.ruc}</td>
                <td>{customer.name}</td>
                <td>{customer.email || "—"}</td>
                <td>{customer.phone || "—"}</td>
                <td>
                  {[
                    customer.address?.street,
                    customer.address?.city,
                    customer.address?.neighborhood,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-semibold ${
                      customer.isActive
                        ? "bg-green-200 text-green-800 border border-green-800"
                        : "bg-red-200 text-red-800 border border-red-800"
                    }`}
                  >
                    {customer.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>{formatDate(customer.createdAt)}</td>
                <td>
                  {customer.isActive && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeactivate(customer._id)}
                        className="px-3 py-1 rounded-md text-sm font-semibold bg-green-200 text-green-800 hover:bg-green-300 border border-green-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeactivate(customer._id)}
                        className="px-3 py-1 rounded-md text-sm font-semibold bg-red-200 text-red-800 hover:bg-red-300 border border-red-800"
                      >
                        Desactivar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
