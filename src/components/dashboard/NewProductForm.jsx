import React, { useEffect, useState } from "react";
import { useProduct } from "../../context/product/ProductContext";

export default function NewProductForm({ onExit = () => {} }) {
  const { createProduct, getProducts, getCategories, categories } = useProduct();
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
      newValue = numericValue.startsWith("0") && numericValue.length > 1
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
      newValue = numericValue.startsWith("0") && numericValue.length > 1
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
    console.log(errors)

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

    if (!product.name.trim() || !product.imageURL.trim() || Number(product.price) <= 0) {
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
      await getProducts({ page: 1, limit: 10, forceRefresh: true });
      setProduct({ name: "", price: 0, imageURL: "", variants: [], category: [] });
      setErrors({ name: "", price: "", imageURL: "", variants: [], category: [] });
      onExit(); // opcional: cerrar modal o limpiar pantalla
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {/* Campos principales */}
      <label>
        Nombre del Producto
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          style={{
            backgroundColor: errors.name ? "#ffe5e5" : "white",
            border: errors.name ? "1px solid red" : "1px solid #ccc",
          }}
          required
        />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </label>

      <label>
        Precio
        <input
          type="number"
          name="price"
          min={1}
          value={product.price}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          style={{
            backgroundColor: errors.price ? "#ffe5e5" : "white",
            border: errors.price ? "1px solid red" : "1px solid #ccc",
          }}
          required
        />
        {errors.price && <span style={{ color: "red" }}>{errors.price}</span>}
      </label>

      <label>
        Imagen (URL)
        <input
          type="text"
          name="imageURL"
          value={product.imageURL}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          style={{
            backgroundColor: errors.imageURL ? "#ffe5e5" : "white",
            border: errors.imageURL ? "1px solid red" : "1px solid #ccc",
          }}
          required
        />
        {errors.imageURL && <span style={{ color: "red" }}>{errors.imageURL}</span>}
      </label>

      {/* Categorías */}
      <fieldset>
        <legend>Categorías:</legend>
        {categories.map((category) => (
          <label key={category._id}>
            <input
              type="checkbox"
              value={category.name}
              checked={product.category.includes(category.name)}
              onChange={handleCategoriesChange}
            />
            {category.name}
          </label>
        ))}
      </fieldset>

      {/* Variantes */}
      {product.variants.map((variant, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <label>
            Abreviación
            <input
              type="text"
              name="abreviation"
              maxLength={2}
              value={variant.abreviation}
              onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
              style={{
                backgroundColor: errors.variants[index]?.abreviation ? "#ffe5e5" : "white",
                border: errors.variants[index]?.abreviation ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.variants[index]?.abreviation && (
              <span style={{ color: "red" }}>{errors.variants[index].abreviation}</span>
            )}
          </label>

          <label>
            Nombre Variante
            <input
              type="text"
              name="variantName"
              value={variant.variantName}
              onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
              style={{
                backgroundColor: errors.variants[index]?.variantName ? "#ffe5e5" : "white",
                border: errors.variants[index]?.variantName ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.variants[index]?.variantName && (
              <span style={{ color: "red" }}>{errors.variants[index].variantName}</span>
            )}
          </label>

          <label>
            Precio Variante
            <input
              type="number"
              name="price"
              min={1}
              value={variant.price}
              onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
              style={{
                backgroundColor: errors.variants[index]?.price ? "#ffe5e5" : "white",
                border: errors.variants[index]?.price ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.variants[index]?.price && (
              <span style={{ color: "red" }}>{errors.variants[index].price}</span>
            )}
          </label>

          <label>
            Código de Barras (opcional)
            <input
              type="text"
              name="barcode"
              value={variant.barcode}
              onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
              style={{
                backgroundColor: errors.variants[index]?.barcode ? "#ffe5e5" : "white",
                border: errors.variants[index]?.barcode ? "1px solid red" : "1px solid #ccc",
              }}
            />
          </label>

          <button type="button" onClick={() => handleDelete(index)}>
            Eliminar Variante
          </button>
        </div>
      ))}

      <button type="button" onClick={addVariant}>
        Añadir Variante
      </button>

      <button type="submit">
        Guardar
      </button>

      <button type="button" onClick={onExit}>
        Cancelar
      </button>
    </form>
  );
}
