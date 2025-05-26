import React, { useState, useEffect } from "react";
import eliminar from "../../../images/eliminar.png";
import anadir from "../../../images/anadir.png";
export default function VariantsTable({ variants, onEdit, editing = false }) {
  const [editData, setEditData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditData(variants);
  }, [variants]);

  const handleChange = (index, field, value) => {
    const updatedVariants = [...editData];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };

    if (field === "price" && value <= 0) {
      setError("El precio debe ser mayor que 0.");
    } else if (
      (field === "abreviation" || field === "variantName") &&
      value.trim() === ""
    ) {
      setError("La abreviación y nombre no pueden estar vacíos.");
    } else {
      setError("");
    }

    setEditData(updatedVariants);
    onEdit(updatedVariants);
  };

  const addVariant = () => {
    const updated = [
      ...editData,
      { abreviation: "", variantName: "", price: 0 },
    ];
    setEditData(updated);
    onEdit(updated);
    setError("");
  };

  const removeVariant = (index) => {
    const updated = editData.filter((_, i) => i !== index);
    setEditData(updated);
    onEdit(updated);
  };

  return (
    <div className="mb-2 overflow-x-auto">
      <table className="min-w-[210px] text-sm border border-gray-200 table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-[60px] px-1 text-left">Código</th>
            <th className="w-[30px] px-1 text-left">Abrev.</th>
            <th className="w-[60px] px-1 text-left">Nombre</th>
            <th className="w-[60px] px-1 -left">Precio</th>
            {editing && <th className="w-[50px] p-1 text-center">🗑️</th>}
          </tr>
        </thead>
        <tbody>
          {editData.map((variant, index) => (
            <tr key={index} className="border-t border-gray-100">
              <td className="w-[60px] p-1">
                {editing ? (
                  <input
                    type="text"
                    className="p-1 border rounded w-full text-sm"
                    value={variant.barcode || ""}
                    onChange={(e) =>
                      handleChange(index, "barcode", e.target.value)
                    }
                  />
                ) : (
                  <span className="text-sm">{variant.barcode}</span>
                )}
              </td>
              <td className="w-[30px] p-1">
                {editing ? (
                  <input
                    type="text"
                    className="p-1 border rounded w-full text-sm"
                    value={variant.abreviation || ""}
                    onChange={(e) =>
                      handleChange(index, "abreviation", e.target.value)
                    }
                  />
                ) : (
                  <div className="  px-1 rounded-md bg-green-200">
                    <p className="text-sm text-center text-green-950 font-medium">
                      {variant.abreviation}
                    </p>
                  </div>
                )}
              </td>
              <td className="w-[130px] p-1">
                {editing ? (
                  <input
                    type="text"
                    className="p-1 border rounded w-full text-sm"
                    value={variant.variantName || ""}
                    onChange={(e) =>
                      handleChange(index, "variantName", e.target.value)
                    }
                  />
                ) : (
                  <span className="text-sm">{variant.variantName}</span>
                )}
              </td>
              <td className="w-[90px] p-1">
                {editing ? (
                  <input
                    type="number"
                    className="p-1 border rounded w-full text-sm"
                    value={variant.price || ""}
                    onChange={(e) =>
                      handleChange(index, "price", Number(e.target.value))
                    }
                  />
                ) : (
                  <span className="text-sm">₲{variant.price}</span>
                )}
              </td>
              {editing && (
                <td className="w-[75px] p-1 text-center">
                  <button
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => removeVariant(index)}
                    title="Eliminar"
                  >
                    <img className="w-10 object-contain" src={eliminar} alt="" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {editing && (
        <button
          onClick={addVariant}
          className="bg-green-200 text-green-950 text-xs rounded px-2 py-2 flex items-center  justify-center gap-1 w-full"
        >
          <span>Agregar Variante</span>
          <img className="w-5 h-5 object-contain" src={anadir} alt="" />
        </button>
      )}
    </div>
  );
}
