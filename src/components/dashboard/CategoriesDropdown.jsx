import React, { useState } from "react";
import { useProduct } from "../../context/product/ProductContext";

export default function CategoriesDropdown({ onExit = true }) {
  const {
    getCategories,
    getProducts,
    createCategory,
    deleteCategory,
    updateCategory,
    categories,
  } = useProduct();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: "" });
  const activateEditing = (category) => {
    setEditing(true);
    setEditForm({ _id: category._id, name: category.name });
  };

  const handleChange = (index, value) => {
    setEditForm({ ...editForm, name: value });
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (editForm.name === "") return;
    try {
      await updateCategory(editForm);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNew = async () => {
    if (addForm.name === "") return;
    try {
      await createCategory(addForm);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      await getCategories(true);
      setAdding(false);
      setAddForm({ name: "" })
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      
      {open && (
        <div>
          <ul>
            {categories.map((category, index) => (
              <li key={category._id}>
                {editing && editForm._id === category._id ? (
                  <div>
                    <input
                      type="text"
                      key={editForm._id}
                      value={editForm.name}
                      onChange={(e) => {
                        handleChange(index, e.target.value);
                      }}
                    />
                    <button type="button" onClick={handleSave}>
                      ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => (setEditing(false), setEditForm({}))}
                    >
                      ❎
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{category.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        activateEditing(category);
                      }}
                    >
                      🖋️
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(category._id);
                  }}
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
            }}
          >
            Añadir➕
          </button>
          {adding && (
            <div>
              <input
                type="text"
                name="name"
                value={addForm.name}
                onChange={(e) => {
                  setAddForm({ name: e.target.value });
                }}
              />
              <button type="button" onClick={handleNew}>
                ✅
              </button>
              <button
                type="button"
                onClick={() => (setAdding(false), setEditForm({}))}
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
          onExit(false);
        }}
      >❎</button>
    </div>
  );
}
