import React, { useState, useEffect } from "react";
import { useProduct } from "../../context/product/ProductContext";

export default function CategoriesMenu({ onExit = () => {} }) {
  const {
    getCategories,
    getProducts,
    createCategory,
    deleteCategory,
    updateCategory,
    categories,
  } = useProduct();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ _id: "", name: "" });
  const [addForm, setAddForm] = useState({ name: "" });
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({ add: "", edit: "" });
  const [open, setOpen] = useState(true); // Añadido para manejar abrir/cerrar

  useEffect(() => {
    getCategories(true);
  }, []);

  const activateEditing = (category) => {
    setEditing(true);
    setEditForm({ _id: category._id, name: category.name });
    setErrors({ ...errors, edit: "" });
  };

  const handleChange = (value) => {
    setEditForm({ ...editForm, name: value });
    if (!value.trim()) {
      setErrors({ ...errors, edit: "El nombre no puede estar vacío." });
    } else {
      setErrors({ ...errors, edit: "" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
    } catch (e) {
      console.error("Error al eliminar categoría:", e);
    }
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setErrors({ ...errors, edit: "El nombre no puede estar vacío." });
      return;
    }
    try {
      await updateCategory(editForm);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
      setEditing(false);
      setEditForm({ _id: "", name: "" });
    } catch (e) {
      console.error("Error al guardar cambios:", e);
    }
  };

  const handleNew = async () => {
    if (!addForm.name.trim()) {
      setErrors({ ...errors, add: "El nombre no puede estar vacío." });
      return;
    }
    try {
      await createCategory(addForm);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
      setAdding(false);
      setAddForm({ name: "" });
      setErrors({ ...errors, add: "" });
    } catch (e) {
      console.error("Error al crear nueva categoría:", e);
    }
  };

  return (
    <div>
      {open && (
        <div>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                {editing && editForm._id === category._id ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleChange(e.target.value)}
                      style={{
                        backgroundColor: errors.edit ? "#ffe5e5" : "white",
                        border: errors.edit ? "1px solid red" : "1px solid #ccc",
                      }}
                    />
                    {errors.edit && (
                      <span style={{ color: "red" }}>{errors.edit}</span>
                    )}
                    <button type="button" onClick={handleSave}>
                      ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setEditForm({ _id: "", name: "" });
                        setErrors({ ...errors, edit: "" });
                      }}
                    >
                      ❎
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{category.name}</p>
                    <button
                      type="button"
                      onClick={() => activateEditing(category)}
                    >
                      🖋️
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(category._id)}
                >
                  🚮
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={adding}
            onClick={() => {
              setAdding(true);
              setErrors({ ...errors, add: "" });
            }}
          >
            Añadir ➕
          </button>

          {adding && (
            <div>
              <input
                type="text"
                name="name"
                value={addForm.name}
                onChange={(e) => {
                  setAddForm({ name: e.target.value });
                  if (!e.target.value.trim()) {
                    setErrors({ ...errors, add: "El nombre no puede estar vacío." });
                  } else {
                    setErrors({ ...errors, add: "" });
                  }
                }}
                style={{
                  backgroundColor: errors.add ? "#ffe5e5" : "white",
                  border: errors.add ? "1px solid red" : "1px solid #ccc",
                }}
              />
              {errors.add && (
                <span style={{ color: "red" }}>{errors.add}</span>
              )}
              <button type="button" onClick={handleNew}>
                ✅
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setAddForm({ name: "" });
                  setErrors({ ...errors, add: "" });
                }}
              >
                ❎
              </button>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          onExit(false);
        }}
      >
        ❎
      </button>
    </div>
  );
}
