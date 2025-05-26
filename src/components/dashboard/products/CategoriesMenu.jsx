import React, { useState, useEffect } from "react";
import { useProduct } from "../../../context/product/ProductContext";
import eliminar from "../../../images/eliminar.png";
import guardar from "../../../images/guardar.png";
import editar from "../../../images/editar.png";

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
      await getProducts({ page: 1, limit: 10,forceRefresh: true });
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
          <div className="flex justify-between items-start mb-5">
            <h1 className="text-green-800 mb-4 w-5 h-5 object-contain">Categorías</h1>
            <button
              type="button"
              className="mt-2"
              onClick={() => {
                setOpen(false);
                onExit(false);
              }}
            >
              <img className="w-5 h-5 object-contain" src={eliminar} alt="" />
            </button>
          </div>

          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                {editing && editForm._id === category._id ? (
                  <div className="flex justify-between gap-3 border-b border-neutral-300 pb-2">
                    <input
                      type="text"
                      value={editForm.name}
                      className="px-2 "
                      onChange={(e) => handleChange(e.target.value)}
                      style={{
                        backgroundColor: errors.edit ? "#ffe5e5" : "white",
                        border: errors.edit
                          ? "1px solid red"
                          : "1px solid #ccc",
                      }}
                    />
                    {errors.edit && (
                      <span style={{ color: "red" }}>{errors.edit}</span>
                    )}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="bg-green-200 rounded px-1 py-1"
                        onClick={handleSave}
                      >
                        <img
                          className="w-4 h-4 object-contain"
                          src={guardar}
                          alt=""
                        />
                      </button>
                      <button
                        className="bg-green-200 rounded px-1 py-1"
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setEditForm({ _id: "", name: "" });
                          setErrors({ ...errors, edit: "" });
                        }}
                      >
                        <img
                          className="w-4 h-4 object-contain"
                          src={eliminar}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between gap-2 border-b border-neutral-300 my-2 pb-2 ">
                    <p className="font-medium">{category.name}</p>
                    <section className="flex justify-end gap-1 ">
                      <button
                        type="button"
                        className="bg-green-200 text-green-950 text-xs rounded px-1 py-1 "
                        onClick={() => activateEditing(category)}
                      >
                        <img
                          className="w-4 h-4 object-contain"
                          src={editar}
                          alt=""
                        />
                      </button>
                      <button
                        type="button"
                        className="bg-green-200 text-green-950 text-xs rounded px-1 py-1 "
                        onClick={() => handleDelete(category._id)}
                      >
                        <span></span>
                        <img
                          className="w-4 h-4 object-contain"
                          src={eliminar}
                          alt=""
                        />
                      </button>
                    </section>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {adding && (
            <div className="flex justify-between">
              <input
                type="text"
                name="name"
                className="pl-2"
                value={addForm.name}
                onChange={(e) => {
                  setAddForm({ name: e.target.value });
                  if (!e.target.value.trim()) {
                    setErrors({
                      ...errors,
                      add: "El nombre no puede estar vacío.",
                    });
                  } else {
                    setErrors({ ...errors, add: "" });
                  }
                }}
                style={{
                  backgroundColor: errors.add ? "#ffe5e5" : "white",
                  border: errors.add ? "1px solid red" : "1px solid #ccc",
                }}
              />
              <div className="flex gap-1">
                <button className="bg-green-200 text-green-950 text-xs rounded px-1 py-1" type="button" onClick={handleNew}>
                  <img
                    className="w-4 h-4 object-contain"
                    src={guardar}
                    alt=""
                  />
                </button>
                <button
                  type="button"
                  className="bg-green-200 text-green-950 text-xs rounded px-1 py-1"
                  onClick={() => {
                    setAdding(false);
                    setAddForm({ name: "" });
                    setErrors({ ...errors, add: "" });
                  }}
                >
                  <img
                    className="w-4 h-4 object-contain"
                    src={eliminar}
                    alt=""
                  />
                </button>
              </div>

            </div>
          )}
          {errors.add && <p style={{ color: "red" }}>{errors.add}</p>}
          <button
            type="button"
            disabled={adding}
            className="bg-green-200 text-green-950 text-xs rounded px-1 py-1 w-full my-2"
            onClick={() => {
              setAdding(true);
              setErrors({ ...errors, add: "" });
            }}
          >
            Añadir Categoría
          </button>
        </div>
      )}
    </div>
  );
}
