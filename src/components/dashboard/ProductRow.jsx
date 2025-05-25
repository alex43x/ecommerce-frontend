import React, { useState } from "react";
import VariantsTable from "./VariantsTable"; // Asegúrate que esté el path correcto
import eliminar from "../../images/eliminar.png";
import guardar from "../../images/guardar.png";
import editar from "../../images/editar.png";
import Swal from "sweetalert2";

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
    setError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await updateProduct({ _id: product._id, ...editForm });
      setEditProductId(null);
      await refreshProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#018242",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(product._id);
        await refreshProducts();
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };

  return (
    <tr className="border-b-2 border-neutral-300">
      <td className="pr-2 pt-1 align-top">
        <div className="w-[120px] break-words">
          {isEditing ? (
            <input
              type="text"
              name="name"
              required
              className="w-full border rounded p-1 font-medium"
              value={editForm.name}
              onChange={handleChange}
            />
          ) : (
            <p className="font-medium">{product.name}</p>
            
          )}
        </div>
      </td>

      <td className="align-top">
        <div className="w-[170px] flex flex-wrap gap-2">
          {isEditing ? (
            categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  value={cat.name}
                  checked={editForm.category.includes(cat.name)}
                  onChange={handleCategoryChange}
                />
                {cat.name}
              </label>
            ))
          ) : (
            <div className="flex flex-wrap ">
              {product.category.map((cat) => (
                <div
                  key={cat}
                  className=" mt-1 mr-1 p-1 rounded-lg bg-white"
                  style={{ border: "2px solid #e0e0e0" }}
                >
                  <p>{cat}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </td>

      <td className="align-top">
        <div className="min-w-[300px] overflow-x-auto">
          <VariantsTable
            variants={isEditing ? editForm.variants : product.variants}
            id={product._id}
            editing={isEditing}
            onEdit={(newVariants) =>
              setEditForm({ ...editForm, variants: newVariants })
            }
          />
        </div>
      </td>

      <td className="p-2 align-top">
        <div className="min-w-[150px] break-all">
          {isEditing ? (
            <input
              type="text"
              name="imageURL"
              className="w-full border rounded p-1"
              value={editForm.imageURL}
              onChange={handleChange}
            />
          ) : (
            product.imageURL
          )}
        </div>
      </td>

      <td className="py-2 align-top">
        <div className="min-w-[100px]">
          {new Date(product.createdAt).toLocaleDateString()}
        </div>
      </td>

      <td className="py-2 align-top">
        <div className="w-[90px] flex flex-col gap-1">
          {error && <p className="text-red-600 text-xs">{error}</p>}
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <button
                onClick={handleSave}
                className="bg-green-200 text-green-950 text-xs rounded px-2 py-1 flex items-center justify-between gap-1"
              >
                <p>Guardar</p>
                <img className="w-4 h-4 object-contain" src={guardar} alt="" />
              </button>
              <button
                onClick={()=>{setEditProductId(null)}}
                className="bg-green-200 text-green-950 text-xs rounded px-2 py-1 flex items-center gap-1"
              >
                <span>Cancelar</span>
                <img className="w-4 h-4 object-contain" src={eliminar} alt="" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <button
                className="bg-green-200 text-green-950 text-xs rounded px-2 py-1 flex items-center gap-1"
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
                <span>Editar</span>
                <img className="w-4 h-4 object-contain" src={editar} alt="" />
              </button>
              <button
                onClick={handleDelete}
                className="bg-green-200 text-green-950 text-xs rounded px-2 py-1 flex items-center gap-1"
              >
                <span>Eliminar</span>
                <img className="w-4 h-4 object-contain" src={eliminar} alt="" />
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
