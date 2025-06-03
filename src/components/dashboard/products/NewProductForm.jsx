import React, { useEffect, useState } from "react";
import { useProduct } from "../../../context/product/ProductContext";
import eliminar from "../../../images/eliminar.png";
import anadir from "../../../images/anadir.png";
import guardar from "../../../images/guardar.png";
export default function NewProductForm({ onExit = () => {} }) {
  const { createProduct, getProducts, getCategories, categories } =
    useProduct();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    imageURL: "",
    variants: [],
    category: [],
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    imageURL: "",
    variants: [],
    category: [],
  });

  useEffect(() => {
    getCategories();
  }, []);

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { variantName: "", price: 0, abreviation: "", barcode: "" },
      ],
    }));
    setErrors((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { variantName: "", price: "", abreviation: "", barcode: "" },
      ],
    }));
  };

  const handleCategoriesChange = (e) => {
    const { value } = e.target;
    setProduct((prev) => ({
      ...prev,
      category: prev.category.includes(value)
        ? prev.category.filter((cat) => cat !== value)
        : [...prev.category, value],
    }));
  };

  const handleDelete = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (name, value) => {
    let newValue = value;
    const newErrors = { ...errors };

    if (name === "price") {
      const numericValue = value.replace(/[^0-9]/g, "");
      newValue =
        numericValue.startsWith("0") && numericValue.length > 1
          ? numericValue.replace(/^0+/, "")
          : numericValue || "0";
    }

    if (!newValue.trim()) {
      newErrors[name] = "Este campo es obligatorio.";
    } else if (name === "price" && parseInt(newValue, 10) <= 0) {
      newErrors[name] = "El precio debe ser mayor que cero.";
    } else {
      newErrors[name] = "";
    }

    setErrors(newErrors);
    setProduct((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleVariantsChange = (index, name, value) => {
    const updatedVariants = [...product.variants];
    const updatedErrors = [...errors.variants];
    let newValue = value;

    if (name === "price") {
      const numericValue = value.replace(/[^0-9]/g, "");
      newValue =
        numericValue.startsWith("0") && numericValue.length > 1
          ? numericValue.replace(/^0+/, "")
          : numericValue || "0";
    }

    if (!updatedErrors[index]) updatedErrors[index] = {};

    if (!newValue.trim() && name !== "barcode") {
      updatedErrors[index][name] = "Este campo es obligatorio.";
    } else if (name === "price" && parseInt(newValue, 10) <= 0) {
      updatedErrors[index][name] = "El precio debe ser mayor que cero.";
    } else {
      updatedErrors[index][name] = "";
    }

    updatedVariants[index][name] = newValue;
    setErrors((prev) => ({ ...prev, variants: updatedErrors }));
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(errors);

    const hasErrors = Object.values(errors).some((error) => {
      if (Array.isArray(error)) {
        return error.some((variantError) =>
          Object.entries(variantError).some(
            ([key, value]) => key !== "barcode" && value
          )
        );
      }
      return error;
    });

    if (hasErrors) {
      alert("Corrige los errores antes de guardar.");
      return;
    }

    if (
      !product.name.trim() ||
      !product.imageURL.trim() ||
      Number(product.price) <= 0
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const finalProduct = { ...product };

    if (finalProduct.variants.length === 0) {
      finalProduct.variants = [
        { variantName: "Normal", price: finalProduct.price, abreviation: "N" },
      ];
    }

    const invalidVariant = finalProduct.variants.some(
      (v) =>
        !v.abreviation.trim() ||
        !v.variantName.trim() ||
        !v.price ||
        v.price <= 0
    );
    if (invalidVariant) {
      alert("Todas las variantes deben ser válidas.");
      return;
    }

    try {
      await createProduct(finalProduct);

      setProduct({
        name: "",
        price: 0,
        imageURL: "",
        variants: [],
        category: [],
      });
      setErrors({
        name: "",
        price: "",
        imageURL: "",
        variants: [],
        category: [],
      });
      onExit(); // opcional: cerrar modal o limpiar pantalla
    } catch (err) {
      console.error(err);
    }
    try {
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 p-2" onSubmit={handleSave}>
      {/* Sección izquierda */}
      <div className="w-full md:w-1/2 px-2">
        <h1 className="text-green-800 text-xl font-bold mb-4">
          Registrar Producto
        </h1>

        {/* Campos principales */}
        <label className="w-full my-2 font-medium">
          Nombre:
          <input
            type="text"
            name="name"
            className="bg-white w-full px-3 py-1 rounded border"
            value={product.name}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            style={{
              backgroundColor: errors.name ? "#ffe5e5" : "white",
              borderColor: errors.name ? "red" : "#ccc",
            }}
            required
          />
          {errors.name && <span className="text-red-600">{errors.name}</span>}
        </label>

        <label className="w-full my-2 font-medium">
          Precio:
          <input
            type="number"
            name="price"
            onWheel={(e) => e.target.blur()}
            className="bg-white w-full px-3 py-1 rounded border"
            min={1}
            value={product.price}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            style={{
              backgroundColor: errors.price ? "#ffe5e5" : "white",
              borderColor: errors.price ? "red" : "#ccc",
            }}
            required
          />
          {errors.price && <span className="text-red-600">{errors.price}</span>}
        </label>

        {/* Categorías */}
        <fieldset className="my-2">
          <legend className="font-medium">Categorías:</legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label key={category._id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={category.name}
                  checked={product.category.includes(category.name)}
                  onChange={handleCategoriesChange}
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Variantes */}
        {product.variants.length > 0 && (
          <h3 className="text-lg font-medium text-green-900 mt-4">
            Variantes:
          </h3>
        )}

        {product.variants.map((variant, index) => (
          <div
            key={index}
            className="p-3 bg-green-100 rounded-lg font-medium mb-4"
          >
            <label className="block mb-2">
              Abreviación:
              <input
                type="text"
                name="abreviation"
                maxLength={3}
                className="w-full px-2 py-1 border rounded"
                value={variant.abreviation}
                onChange={(e) =>
                  handleVariantsChange(index, e.target.name, e.target.value)
                }
                style={{
                  backgroundColor: errors.variants[index]?.abreviation
                    ? "#ffe5e5"
                    : "white",
                  borderColor: errors.variants[index]?.abreviation
                    ? "red"
                    : "#ccc",
                }}
                required
              />
              {errors.variants[index]?.abreviation && (
                <span className="text-red-600 text-sm">
                  {errors.variants[index].abreviation}
                </span>
              )}
            </label>

            <label className="block mb-2">
              Nombre Variante:
              <input
                type="text"
                name="variantName"
                className="w-full px-2 py-1 border rounded"
                value={variant.variantName}
                onChange={(e) =>
                  handleVariantsChange(index, e.target.name, e.target.value)
                }
                style={{
                  backgroundColor: errors.variants[index]?.variantName
                    ? "#ffe5e5"
                    : "white",
                  borderColor: errors.variants[index]?.variantName
                    ? "red"
                    : "#ccc",
                }}
                required
              />
              {errors.variants[index]?.variantName && (
                <span className="text-red-600 text-sm">
                  {errors.variants[index].variantName}
                </span>
              )}
            </label>

            <label className="block mb-2">
              Precio Variante:
              <input
                type="number"
                name="price"
                onWheel={(e) => e.target.blur()}
                min={1}
                className="w-full px-2 py-1 border rounded"
                value={variant.price}
                onChange={(e) =>
                  handleVariantsChange(index, e.target.name, e.target.value)
                }
                style={{
                  backgroundColor: errors.variants[index]?.price
                    ? "#ffe5e5"
                    : "white",
                  borderColor: errors.variants[index]?.price ? "red" : "#ccc",
                }}
                required
              />
              {errors.variants[index]?.price && (
                <span className="text-red-600 text-sm">
                  {errors.variants[index].price}
                </span>
              )}
            </label>

            <label className="block mb-2">
              Código de Barras (opcional):
              <input
                type="text"
                name="barcode"
                className="w-full px-2 py-1 border rounded"
                value={variant.barcode}
                onChange={(e) =>
                  handleVariantsChange(index, e.target.name, e.target.value)
                }
              />
            </label>

            <button
              className="bg-red-100 text-red-800 text-xs rounded px-2 py-1 flex items-center justify-center gap-1 w-full mt-2"
              type="button"
              onClick={() => handleDelete(index)}
            >
              <span>Eliminar</span>
              <img className="w-4 h-4 object-contain" src={eliminar} alt="" />
            </button>
          </div>
        ))}

        {/* Botones */}
        <section className="flex flex-col sm:flex-row gap-2 my-4">
          <button
            className="bg-green-200 text-green-950 text-xs rounded px-2 py-2 flex items-center justify-center gap-1 w-full"
            type="button"
            onClick={addVariant}
          >
            <span>Agregar Variante</span>
            <img className="w-5 h-5 object-contain" src={anadir} alt="" />
          </button>

          <button
            className="bg-green-200 text-green-950 text-xs rounded px-2 py-2 flex items-center justify-center gap-1 w-full"
            type="submit"
          >
            <span>Guardar</span>
            <img className="w-5 h-5 object-contain" src={guardar} alt="" />
          </button>
        </section>
      </div>

      {/* Sección derecha: Imagen */}
      <div className="w-full md:w-1/2 px-2">
        <div className="flex justify-end mb-2">
          <button
            className="text-green-950 text-xs rounded-full p-1"
            type="button"
            onClick={onExit}
          >
            <img className="w-5 h-5 object-contain" src={eliminar} alt="" />
          </button>
        </div>

        <label className="block w-full my-2 font-medium">
          Imagen (URL):
          <input
            type="text"
            name="imageURL"
            className="bg-white w-full px-3 py-1 border rounded"
            value={product.imageURL}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            style={{
              backgroundColor: errors.imageURL ? "#ffe5e5" : "white",
              borderColor: errors.imageURL ? "red" : "#ccc",
            }}
            required
          />
          {errors.imageURL && (
            <span className="text-red-600">{errors.imageURL}</span>
          )}
        </label>

        <div className="mt-4">
          <img
            className="mx-auto rounded-2xl max-w-full h-auto"
            src={product.imageURL}
            alt="Vista previa"
          />
        </div>
      </div>
    </form>
  );
}
