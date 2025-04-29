import React, { useState } from "react";
import VariantsTable from "./VariantsTable"; // Asegúrate que esté el path correcto

export default function ProductRow({
  product,
  categories,
  editProductId,
  setEditProductId,
  editForm,
  setEditForm,
  updateProduct,
  deleteProduct,
  refreshProducts,
}) {
  const [error, setError] = useState("");

  const isEditing = editProductId === product._id;

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditForm({
        ...editForm,
        category: [...editForm.category, value],
      });
    } else {
      setEditForm({
        ...editForm,
        category: editForm.category.filter((c) => c !== value),
      });
    }
  };

  const validateForm = () => {
    if (!editForm.name.trim()) {
      setError("El nombre es obligatorio.");
      return false;
    }
    if (editForm.price <= 0) {
      setError("El precio debe ser mayor que cero.");
      return false;
    }
    if (!editForm.imageURL.trim()) {
      setError("La URL de la imagen es obligatoria.");
      return false;
    }
    if (editForm.category.length === 0) {
      setError("Debe seleccionar al menos una categoría.");
      return false;
    }
    if (
      editForm.variants?.some(
        (variant) =>
          !variant.variantName?.trim() ||
          !variant.price ||
          !variant.abreviation?.trim()
      )
    ) {
      setError("Las variantes deben tener abreviación, nombre y precio.");
      return false;
    }
    setError(""); // Sin errores
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Solo guarda si la validación pasa
    try {
      await updateProduct({ _id: product._id, ...editForm });
      setEditProductId(null);
      await refreshProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product._id);
      await refreshProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="name"
            required
            value={editForm.name}
            onChange={handleChange}
          />
        ) : (
          product.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="price"
            required
            min={1}
            value={editForm.price}
            onChange={handleChange}
          />
        ) : (
          `₲${product.price}`
        )}
      </td>
      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
      <td>
        {isEditing
          ? categories.map((cat) => (
              <label key={cat._id} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={cat.name}
                  checked={editForm.category.includes(cat.name)}
                  onChange={handleCategoryChange}
                />
                {cat.name}
              </label>
            ))
          : product.category.join(", ")}
      </td>
      <td>
        <VariantsTable
          variants={isEditing ? editForm.variants : product.variants}
          id={product._id}
          editing={isEditing}
          onEdit={(newVariants) =>
            setEditForm({ ...editForm, variants: newVariants })
          }
        />
      </td>
      <td className="w-8">
        {isEditing ? (
          <input
            type="text"
            name="imageURL"
            value={editForm.imageURL}
            onChange={handleChange}
          />
        ) : (
          product.imageURL
        )}
      </td>
      {error && <div style={{ color: "red", marginTop: "5px" }}>{error}</div>}
      <td>
        {isEditing ? (
          <div>
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setEditProductId(null)}>Cancelar</button>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                setEditProductId(product._id);
                setEditForm({
                  name: product.name,
                  price: product.price,
                  imageURL: product.imageURL,
                  category: product.category,
                  variants: product.variants,
                });
              }}
            >
              Editar
            </button>
            <button onClick={handleDelete}>Eliminar</button>
          </>
        )}
      </td>
    </tr>
  );
}
