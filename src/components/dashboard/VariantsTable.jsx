import React, { useState, useEffect } from "react";

export default function VariantsTable({ variants, onEdit, editing = false }) {
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    setEditData(variants);
  }, [variants]);

  const handleChange = (index, field, value) => {
    const updatedVariants = [...editData];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
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
  };

  const removeVariant = (index) => {
    const updated = editData.filter((_, i) => i !== index);
    setEditData(updated);
    onEdit(updated);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <table>
        <thead>
          <tr>
            <th>Abreviación</th>
            <th>Nombre</th>
            <th>Precio</th>
            {editing && <th>Eliminar</th>}
          </tr>
        </thead>
        <tbody>
          {editData.map((variant, index) => (
            <tr key={index}>
              <td>
                {editing ? (
                  <input
                    type="text"
                    value={variant.abreviation || ""}
                    onChange={(e) =>
                      handleChange(index, "abreviation", e.target.value)
                    }
                  />
                ) : (
                  variant.abreviation
                )}
              </td>
              <td>
                {editing ? (
                  <input
                    type="text"
                    value={variant.variantName || ""}
                    onChange={(e) =>
                      handleChange(index, "variantName", e.target.value)
                    }
                  />
                ) : (
                  variant.variantName
                )}
              </td>

              <td>
                {editing ? (
                  <input
                    type="number"
                    value={variant.price || ""}
                    onChange={(e) =>
                      handleChange(index, "price", e.target.value)
                    }
                  />
                ) : (
                  `₲${variant.price}`
                )}
              </td>
              {editing && (
                <td>
                  <button onClick={() => removeVariant(index)}>🗑️</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <button style={{ marginTop: "10px" }} onClick={addVariant}>
          ➕ Agregar Variante
        </button>
      )}
    </div>
  );
}
