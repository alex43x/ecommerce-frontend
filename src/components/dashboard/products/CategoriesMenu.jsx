import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useProduct } from "../../../context/product/ProductContext";
import eliminar from "../../../images/eliminar.png";
import error from "../../../images/error.png";
import guardar from "../../../images/guardar.png";
import editar from "../../../images/editar.png";
import anadir from "../../../images/anadir.png";

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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    getCategories(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activateEditing = (category) => {
    setEditing(true);
    setEditForm({ _id: category._id, name: category.name });
    setErrors((prev) => ({ ...prev, edit: "" }));
  };

  const handleChange = (value) => {
    setEditForm((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({
      ...prev,
      edit: value.trim() ? "" : "El nombre no puede estar vacío.",
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
    } catch {
      Swal.fire("Error", "Ocurrió un problema al procesar la operación.", "error");

    }
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        edit: "El nombre no puede estar vacío.",
      }));
      return;
    }
    try {
      await updateCategory(editForm);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
      setEditing(false);
      setEditForm({ _id: "", name: "" });
    } catch {
      Swal.fire(
        "Error",
        "Ocurrió un problema al procesar la operación.",
        "error"
      );
    }
  };

  const handleNew = async () => {
    if (!addForm.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        add: "El nombre no puede estar vacío.",
      }));
      return;
    }
    try {
      await createCategory(addForm);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
      setAdding(false);
      setAddForm({ name: "" });
      setErrors((prev) => ({ ...prev, add: "" }));
    } catch {
      Swal.fire(
        "Error",
        "Ocurrió un problema al procesar la operación.",
        "error"
      );
    }
  };

  return (
    <div>
      {open && (
        <div>
          {/* Encabezado */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-green-800 font-medium text-3xl">
              Administrar Categorías
            </h1>
            <button
              type="button"
              className="mt-2"
              onClick={() => {
                setOpen(false);
                onExit(false);
              }}
            >
              <img
                className="w-5 h-5 object-contain"
                src={eliminar}
                alt="Cerrar"
              />
            </button>
          </div>

          {/* Lista de categorías */}
          <ul className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <li key={category._id}>
                {editing && editForm._id === category._id ? (
                  <div className="border-b-2 border-neutral-400 pb-4">
                    <input
                      type="text"
                      value={editForm.name}
                      className="px-2 py-1 mb-2 w-full"
                      onChange={(e) => handleChange(e.target.value)}
                      style={{
                        backgroundColor: errors.edit ? "#ffe5e5" : "white",
                        border: errors.edit
                          ? "1px solid red"
                          : "1px solid #ccc",
                      }}
                      placeholder="Nombre de categoría"
                    />
                    {errors.edit && (
                      <p className="text-red-600 text-sm">{errors.edit}</p>
                    )}

                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="flex items-center gap-1 bg-green-200 border border-green-800 rounded px-2 py-1 text-green-800 hover:bg-green-300 transition"
                        onClick={handleSave}
                      >
                        <p>Guardar</p>
                        <img
                          className="w-4 h-4 object-contain"
                          src={guardar}
                          alt="Guardar"
                        />
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 bg-neutral-200 border border-neutral-800 rounded px-2 py-1 text-neutral-800 hover:bg-neutral-300 transition"
                        onClick={() => {
                          setEditing(false);
                          setEditForm({ _id: "", name: "" });
                          setErrors((prev) => ({ ...prev, edit: "" }));
                        }}
                      >
                        <p>Cancelar</p>
                        <img
                          className="w-4 h-4 object-contain"
                          src={eliminar}
                          alt="Cancelar"
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-b-2 border-neutral-400 pb-4">
                    <p className="font-medium text-lg mb-3">{category.name}</p>
                    <section className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="bg-green-200 text-green-800 rounded px-3 py-1 border border-green-800 hover:bg-green-300 transition flex items-center gap-2"
                        onClick={() => activateEditing(category)}
                      >
                        <p>Editar</p>
                        <img
                          className="w-4 h-4 object-contain"
                          src={editar}
                          alt="Editar"
                        />
                      </button>
                      <button
                        type="button"
                        className="bg-red-200 text-red-800 rounded px-3 py-1 border border-red-800 hover:bg-red-300 transition flex items-center gap-2"
                        onClick={() => handleDelete(category._id)}
                      >
                        <p>Eliminar</p>
                        <img
                          className="w-4 h-4 object-contain"
                          src={error}
                          alt="Eliminar"
                        />
                      </button>
                    </section>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Agregar nueva categoría */}
          {adding && (
            <div className="mt-4">
              <p className="font-medium text-lg mb-2">Nueva Categoría</p>
              <input
                type="text"
                name="name"
                className="pl-2 py-1 mb-2 w-full"
                placeholder="Nombre de la categoría"
                value={addForm.name}
                onChange={(e) => {
                  setAddForm({ name: e.target.value });
                  setErrors((prev) => ({
                    ...prev,
                    add: e.target.value.trim()
                      ? ""
                      : "El nombre no puede estar vacío.",
                  }));
                }}
                style={{
                  backgroundColor: errors.add ? "#ffe5e5" : "white",
                  border: errors.add ? "1px solid red" : "1px solid #ccc",
                }}
              />
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  className="flex items-center gap-3 bg-green-200 border border-green-800 rounded px-3 py-1 text-green-800 hover:bg-green-300 transition w-2/3 justify-center"
                  onClick={handleNew}
                >
                  <p>Guardar Cambios</p>
                  <img
                    className="w-4 h-4 object-contain"
                    src={guardar}
                    alt="Guardar"
                  />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-neutral-200 border border-neutral-800 rounded px-3 py-1 text-neutral-800 hover:bg-neutral-300 transition w-1/3 justify-center"
                  onClick={() => {
                    setAdding(false);
                    setAddForm({ name: "" });
                    setErrors((prev) => ({ ...prev, add: "" }));
                  }}
                >
                  <p>Cancelar</p>
                  <img
                    className="w-4 h-4 object-contain"
                    src={eliminar}
                    alt="Cancelar"
                  />
                </button>
              </div>
              {errors.add && (
                <p className="text-red-600 text-sm mt-1">{errors.add}</p>
              )}
            </div>
          )}

          {/* Botón Añadir Categoría */}
          <button
            type="button"
            disabled={adding}
            className="flex items-center justify-center gap-2 bg-green-200 border border-green-800 rounded px-2 py-1 text-green-800 hover:bg-green-300 transition w-full my-2"
            onClick={() => {
              setAdding(true);
              setErrors((prev) => ({ ...prev, add: "" }));
            }}
          >
            Añadir Categoría
            <img className="w-4 object-contain" src={anadir} alt="Añadir" />
          </button>
        </div>
      )}
    </div>
  );
}
