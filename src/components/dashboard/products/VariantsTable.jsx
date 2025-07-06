import React, { useState, useEffect } from "react";
import eliminar from "../../../images/error.png";
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
      <table className="min-w-[210px] text-sm  table-fixed">
        <thead >
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
            <tr key={index} >
              <td className="w-[70px] p-1">
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
              <td className="w-[20px] p-1">
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
                  <div className="  p-1 rounded-md bg-green-200 border border-green-800">
                    <p className="text-sm text-center text-green-800 font-medium ">
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
                  <span className="text-sm font-medium">{variant.variantName}</span>
                )}
              </td>
              <td className="w-[90px] p-1">
                {editing ? (
                  <input
                    type="number"
                    className="p-1 border rounded w-full text-sm border-neutral-400"
                    value={variant.price || ""}
                    onChange={(e) =>
                      handleChange(index, "price", Number(e.target.value))
                    }
                  />
                ) : (
                  <span className="text-sm">{variant.price.toLocaleString("es-PY", { style: "currency", currency: "PYG" })}</span>
                )}
              </td>
              {editing && (
                <td className="w-[240px] p-1 text-center">
                  <button
                    className="bg-red-100 text-sm border border-red-800 p-1 text-red-800 w-fit flex gap-1"
                    onClick={() => removeVariant(index)}
                    title="Eliminar"
                  >
                    <p>Borrar</p>
                    <img className="w-4 object-contain" src={eliminar} alt="" />
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
          className="bg-green-200 text-green-800 text-md rounded-lg p-1 mt-1 flex items-center  justify-center gap-1 w-full border border-green-800"
        >
          <span>Agregar Variante</span>
          <img className="w-5 h-5 object-contain" src={anadir} alt="" />
        </button>
      )}
    </div>
  );
}
