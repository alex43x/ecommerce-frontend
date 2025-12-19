import React, { useEffect, useState } from "react";
import { useProduct } from "../../../context/product/ProductContext";
import Swal from "sweetalert2";
import eliminar from "../../../images/eliminar.png";
import imagen from "../../../images/imagen.png";
import error from "../../../images/error.png";
import anadir from "../../../images/anadir.png";
import guardar from "../../../images/guardar.png";

export default function NewProductForm({ onExit = () => {} }) {
  const { createProduct, getProducts, getCategories, categories } = useProduct();

  const [product, setProduct] = useState({
    name: "",
    price: "0",
    imageURL: "",
    variants: [],
    category: [],
    ivaRate: 10 // IVA por defecto en número
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    imageURL: "",
    variants: [],
    category: [],
    ivaRate: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { variantName: "", price: "0", abreviation: "", barcode: "", ivaRate: prev.ivaRate }
      ]
    }));
    setErrors((prev) => ({
      ...prev,
      variants: [...prev.variants, { variantName: "", price: "", abreviation: "", barcode: "", ivaRate: "" }]
    }));
  };

  const handleCategoriesChange = (e) => {
    const { value } = e.target;
    setProduct((prev) => ({
      ...prev,
      category: prev.category.includes(value)
        ? prev.category.filter((cat) => cat !== value)
        : [...prev.category, value]
    }));
  };

  const handleDelete = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
    setErrors((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
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

  const handleIvaChange = (e) => {
    let value = e.target.value;
    if (value === "Exento") value = 0;
    else value = parseInt(value, 10); // "10%" o "5%" -> 10 o 5
    setProduct((prev) => ({ ...prev, ivaRate: value }));
    setErrors((prev) => ({ ...prev, ivaRate: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación de errores
    const hasErrors = Object.values(errors).some((error) => {
      if (Array.isArray(error)) {
        return error.some((variantError) =>
          Object.entries(variantError).some(([key, value]) => key !== "barcode" && value)
        );
      }
      return error;
    });

    if (hasErrors) {
      setIsSubmitting(false);
      await Swal.fire({
        title: "Error",
        text: "Corrige los errores antes de guardar.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!product.name.trim() || !product.imageURL.trim() || Number(product.price) <= 0) {
      setIsSubmitting(false);
      await Swal.fire({
        title: "Campos incompletos",
        text: "Completa todos los campos obligatorios.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (![0, 5, 10].includes(product.ivaRate)) {
      setErrors((prev) => ({ ...prev, ivaRate: "Selecciona un IVA válido." }));
      setIsSubmitting(false);
      await Swal.fire({
        title: "IVA inválido",
        text: "Selecciona un IVA válido antes de guardar.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const finalProduct = { ...product };

    if (finalProduct.variants.length === 0) {
      finalProduct.variants = [
        { variantName: "Normal", price: finalProduct.price, abreviation: "N", ivaRate: finalProduct.ivaRate },
      ];
    } else {
      finalProduct.variants = finalProduct.variants.map((v) => ({
        ...v,
        ivaRate: v.ivaRate ?? finalProduct.ivaRate
      }));
    }

    const invalidVariant = finalProduct.variants.some(
      (v) => !v.abreviation.trim() || !v.variantName.trim() || !v.price || v.price <= 0
    );

    if (invalidVariant) {
      setIsSubmitting(false);
      await Swal.fire({
        title: "Variantes inválidas",
        text: "Todas las variantes deben ser válidas.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      await createProduct(finalProduct);

      await Swal.fire({
        title: "¡Éxito!",
        text: "El producto se ha guardado correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setProduct({
        name: "",
        price: "0",
        imageURL: "",
        variants: [],
        category: [],
        ivaRate: 10
      });

      setErrors({
        name: "",
        price: "",
        imageURL: "",
        variants: [],
        category: [],
        ivaRate: ""
      });

      try {
        await getProducts({ page: 1, limit: 10, category: "", search: "", sortBy: "dateDesc", forceRefresh: true });
      } catch {
        await Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar la lista de productos.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }

      onExit();
    } catch {
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el producto.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="flex justify-between m-2 items-center mb-3 ">
        <h1 className="text-green-800 text-3xl font-medium ">Registrar Producto</h1>
        <button className="text-green-950 text-xs rounded-full p-1" type="button" onClick={onExit}>
          <img className="w-5 h-5 object-contain" src={eliminar} alt="" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pb-4">
        {/* Sección izquierda */}
        <div className="w-full md:w-1/2 px-2 flex flex-col ">
          {/* Campos principales */}
          <label className="w-full my-2 font-medium text-lg">
            Nombre:
            <input
              type="text"
              name="name"
              className="bg-white w-full px-2 py-1 rounded border"
              value={product.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Nombre del Producto"
              style={{ backgroundColor: errors.name ? "#ffe5e5" : "white", borderColor: errors.name ? "red" : "#ccc" }}
              required
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </label>

          <label className="w-full my-2 font-medium text-lg">
            Precio:
            <input
              type="number"
              name="price"
              onWheel={(e) => e.target.blur()}
              className="bg-white w-full px-2 py-1 rounded border"
              placeholder="Precio del Producto"
              min={1}
              value={product.price}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              style={{ backgroundColor: errors.price ? "#ffe5e5" : "white", borderColor: errors.price ? "red" : "#ccc" }}
              required
            />
            {errors.price && <p className="text-red-600">{errors.price}</p>}
          </label>

          {/* Selección de IVA */}
          <fieldset className="my-2">
            <legend className="font-medium mb-2 text-lg">IVA:</legend>
            <div className="flex gap-4">
              {["10%", "5%", "Exento"].map((option) => (
                <label key={option} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="ivaRate"
                    value={option}
                    checked={
                      (option === "Exento" && product.ivaRate === 0) ||
                      (option === "5%" && product.ivaRate === 5) ||
                      (option === "10%" && product.ivaRate === 10)
                    }
                    onChange={handleIvaChange}
                    className="h-5 w-5 rounded"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.ivaRate && <p className="text-red-600">{errors.ivaRate}</p>}
          </fieldset>

          {/* Categorías */}
          <fieldset className="my-2">
            <legend className="font-medium mb-2 text-lg">Categorías:</legend>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center gap-1 my-1">
                  <input
                    type="checkbox"
                    value={category.name}
                    checked={product.category.includes(category.name)}
                    onChange={handleCategoriesChange}
                    className="h-5 w-5 rounded"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Botones */}
          <section className="flex flex-col sm:flex-row gap-2 font-medium w-full mt-auto">
            <button
              className="bg-neutral-200 text-neutral-800 rounded px-2 py-2 flex items-center justify-center gap-2 w-7/12 border border-neutral-800 hover:bg-neutral-300"
              type="button"
              onClick={addVariant}
            >
              <span>Agregar Variante</span>
              <img className="w-5 h-5 object-contain" src={anadir} alt="" />
            </button>

            <button
              className="bg-green-200 text-green-800 rounded px-2 py-2 flex items-center justify-center gap-2 w-5/12 border border-green-800 hover:bg-green-300"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Guardando...</span>
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                </>
              ) : (
                <>
                  <span>Guardar</span>
                  <img className="w-5 h-5 object-contain" src={guardar} alt="" />
                </>
              )}
            </button>
          </section>
        </div>

        {/* Sección derecha: Imagen */}
        <div className="w-full md:w-1/2 px-2">
          <label className="block w-full my-2 mb-2 font-medium text-lg">
            Imagen (URL):
            <input
              type="text"
              name="imageURL"
              className="bg-white w-full px-3 py-1 border rounded"
              placeholder="URL de la Imagen"
              value={product.imageURL}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              style={{ backgroundColor: errors.imageURL ? "#ffe5e5" : "white", borderColor: errors.imageURL ? "red" : "#ccc" }}
              required
            />
            {errors.imageURL && <span className="text-red-600">{errors.imageURL}</span>}
          </label>

          <div className="mt-4">
            <img
              className="mx-auto rounded-2xl w-full h-72 object-cover shadow-lg shadow-neutral-700"
              src={product.imageURL || imagen}
              alt="Vista previa"
            />
          </div>
        </div>
      </div>

      {/* Variantes */}
      {product.variants.length > 0 && (
        <div>
          <h3 className="text-lg font-medium ml-2 my-2">Variantes:</h3>
          <div className="grid grid-cols-3 gap-2 mx-2 border-2 rounded-lg border-neutral-300 p-2">
            {product.variants.map((variant, index) => (
              <div key={index} className="p-3 bg-green-100 rounded-lg font-medium border border-green-800">
                <div className="flex justify-between items-center mb-1">
                  <label>Abreviación:</label>
                  <button
                    className="rounded p-1 flex items-center justify-center gap-1 w-fit"
                    type="button"
                    onClick={() => handleDelete(index)}
                  >
                    <img className="w-4 h-4 object-contain" src={error} alt="" />
                  </button>
                </div>
                <input
                  type="text"
                  name="abreviation"
                  maxLength={3}
                  className="w-full px-2 py-1 border rounded"
                  value={variant.abreviation}
                  placeholder="Abreviación para el POS"
                  onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
                  style={{ backgroundColor: errors.variants[index]?.abreviation ? "#ffe5e5" : "white", borderColor: errors.variants[index]?.abreviation ? "red" : "#ccc" }}
                  required
                />
                {errors.variants[index]?.abreviation && (
                  <span className="text-red-600 text-sm">{errors.variants[index].abreviation}</span>
                )}

                <label className="block mb-2">
                  Nombre Variante:
                  <input
                    type="text"
                    name="variantName"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Nombre de la variante"
                    value={variant.variantName}
                    onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
                    style={{ backgroundColor: errors.variants[index]?.variantName ? "#ffe5e5" : "white", borderColor: errors.variants[index]?.variantName ? "red" : "#ccc" }}
                    required
                  />
                  {errors.variants[index]?.variantName && (
                    <span className="text-red-600 text-sm">{errors.variants[index].variantName}</span>
                  )}
                </label>

                <label className="block mb-2">
                  Precio Variante:
                  <input
                    type="number"
                    name="price"
                    placeholder="Precio de la variante"
                    onWheel={(e) => e.target.blur()}
                    min={1}
                    className="w-full px-2 py-1 border rounded"
                    value={variant.price}
                    onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
                    style={{ backgroundColor: errors.variants[index]?.price ? "#ffe5e5" : "white", borderColor: errors.variants[index]?.price ? "red" : "#ccc" }}
                    required
                  />
                  {errors.variants[index]?.price && (
                    <p className="text-red-600 text-sm">{errors.variants[index].price}</p>
                  )}
                </label>

                <label className="block mb-2">
                  Código de Barras (opcional):
                  <input
                    type="text"
                    name="barcode"
                    placeholder="Código de Barras "
                    className="w-full px-2 py-1 border rounded"
                    value={variant.barcode}
                    onChange={(e) => handleVariantsChange(index, e.target.name, e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
