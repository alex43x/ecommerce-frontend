import React, { useState, useEffect } from "react";
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
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-green-800 font-medium text-3xl ">
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
              <img className="w-5 h-5 object-contain" src={eliminar} alt="" />
            </button>
          </div>

          <ul className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <li key={category._id}>
                {editing && editForm._id === category._id ? (
                  <div className=" border-b-2 border-neutral-400 pb-4 ">
                    <input
                      type="text"
                      value={editForm.name}
                      className="px-2 py-1 mb-2"
                      onChange={(e) => handleChange(e.target.value)}
                      style={{
                        backgroundColor: errors.edit ? "#ffe5e5" : "white",
                        border: errors.edit
                          ? "1px solid red"
                          : "1px solid #ccc",
                      }}
                    />
                    {errors.edit && (
                      <p style={{ color: "red" }}>{errors.edit}</p>
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
                          alt=""
                        />
                      </button>
                      <button
                        className="flex items-center gap-1 bg-neutral-200 border border-neutral-800 rounded px-2 py-1 text-neutral-800 hover:bg-neutral-300 transition"
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setEditForm({ _id: "", name: "" });
                          setErrors({ ...errors, edit: "" });
                        }}
                      >
                        <p>Cancelar</p>
                        <img
                          className="w-4 h-4 object-contain"
                          src={eliminar}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="  border-b-2 border-neutral-400 pb-4 ">
                    <p className="font-medium text-lg mb-3">{category.name}</p>
                    <section className="flex justify-end gap-1 ">
                      <button
                        type="button"
                        className="bg-green-200 text-green-800 rounded px-3 py-1 border border-green-800 hover:bg-green-300 transition flex items-center gap-2"
                        onClick={() => activateEditing(category)}
                      >
                        <p>Editar</p>
                        <img
                          className="w-4 h-4 object-contain"
                          src={editar}
                          alt=""
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
            <div className="">
              <p className="font-medium text-lg my-2">Nueva Categoría</p>
              <input
                type="text"
                name="name"
                className="pl-2 py-1 mb-2 w-full"
                placeholder="Nombre de la categoría"
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
              <div className="flex gap-2 w-full">
                <button
                  className="flex items-center gap-3 bg-green-200 border border-green-800 rounded px-3 py-1 text-green-800 hover:bg-green-300 transition w-2/3 justify-center"
                  type="button"
                  onClick={handleNew}
                >
                  <p>Guardar Cambios</p>
                  <img
                    className="w-4 h-4 object-contain"
                    src={guardar}
                    alt=""
                  />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-neutral-200 border border-neutral-800 rounded px-3 py-1 text-neutral-800 hover:bg-neutral-300 transition w-1/3 justify-center"
                  onClick={() => {
                    setAdding(false);
                    setAddForm({ name: "" });
                    setErrors({ ...errors, add: "" });
                  }}
                >
                  <p>Cancelar</p>
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
            className="flex items-center justify-center gap-2 bg-green-200 border border-green-800 rounded px-2 py-1 text-green-800 hover:bg-green-300 transition w-full my-2"
            onClick={() => {
              setAdding(true);
              setErrors({ ...errors, add: "" });
            }}
          >
            Añadir Categoría
            <img className="w-4 object-contain" src={anadir} alt="" />
          </button>
        </div>
      )}
    </div>
  );
}
