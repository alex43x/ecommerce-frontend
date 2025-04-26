import React, { useEffect, useState } from "react";
import { useProduct } from "../../context/product/ProductContext";

export default function NewProductForm({ onExit = true }) {
  const { createProduct, getProducts, getCategories, categories } =
    useProduct();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    imageURL: "",
    variants: [],
    category: [],
  });

  useEffect(() => {
    getCategories();
  }, []);

  const addVariant = () => {
    const updatedProduct = { ...product };
    updatedProduct.variants.push({
      variantName: "",
      price: 0,
      abreviation: "",
    });
    setProduct(updatedProduct);
  };

  const handleCategoriesChange = (e) => {
    let updatedCategories = [...product.category];
    if (!updatedCategories.includes(e.target.value)) {
      updatedCategories.push(e.target.value);
    } else {
      updatedCategories = updatedCategories.filter(
        (_, i) => updatedCategories[i] !== e.target.value
      );
    }
    setProduct({ ...product, category: updatedCategories });
    console.log(product);
  };

  const handleDelete = (index) => {
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: updatedVariants });
  };
  const handleChange = (name, value) => {
    let updatedProduct = { ...product };

    if (name === "price") {
      updatedProduct[name] = value === "" ? "" : Number(value);
    } else {
      updatedProduct[name] = value;
    }

    setProduct(updatedProduct);
  };

  const handleVariantsChange = (index, name, value) => {
    const updatedVariants = [...product.variants];

    if (name === "price") {
      updatedVariants[index][name] = value === "" ? "" : Number(value);
    } else {
      updatedVariants[index][name] = value;
    }

    setProduct({ ...product, variants: updatedVariants });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }
    if (!product.imageURL.trim()) {
      alert("La imagen es obligatoria.");
      return;
    }
    if (!product.price || Number(product.price) <= 0) {
      alert("El precio debe ser mayor a 0.");
      return;
    }

    let finalProduct = { ...product };
    if (finalProduct.variants.length === 0) {
      finalProduct.variants = [
        { variantName: "Normal", price: finalProduct.price, abreviation: "N" },
      ];
    }

    const invalidVariant = finalProduct.variants.some(
      (variant) =>
        !variant.abreviation.trim() ||
        !variant.variantName.trim() ||
        !variant.price ||
        variant.price <= 0
    );
    if (invalidVariant) {
      alert("Todas las variantes deben ser válidas.");
      return;
    }

    try {
      await createProduct(finalProduct);
      await getProducts({ page: 1, limit: 10, forceRefresh: true });

      setProduct({
        name: "",
        price: 0,
        imageURL: "",
        variants: [],
        category: [],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form>
      <label key="name">
        Nombre del Producto
        <input
          type="text"
          name="name"
          value={product.name}
          required
          onChange={(e) => {
            handleChange(e.target.name, e.target.value);
          }}
        />
      </label>
      <label key="price">
        Precio
        <input
          type="number"
          name="price"
          min={1}
          value={product.price}
          required
          onChange={(e) => {
            handleChange(e.target.name, e.target.value);
          }}
        />
      </label>
      <label key="imageURL">
        Imagen - Link
        <input
          type="text"
          name="imageURL"
          value={product.imageURL}
          required
          onChange={(e) => {
            handleChange(e.target.name, e.target.value);
          }}
        />
      </label>
      <label>Categorias:</label>
      {categories.map((category) => (
        <label key={category._id}>
          <input
            type="checkbox"
            value={category.name}
            checked={product.category.includes(category.name)}
            onChange={(e) => {
              handleCategoriesChange(e);
            }}
          />
          {category.name}
        </label>
      ))}
      {product.variants?.map((variant, index) => (
        <div key={index}>
          <label htmlFor="">
            Abreviación
            <input
              type="text"
              name="abreviation"
              value={variant.abreviation}
              required
              maxLength={2}
              onChange={(e) => {
                handleVariantsChange(index, e.target.name, e.target.value);
              }}
            />
          </label>
          <label htmlFor="">
            Nombre
            <input
              type="text"
              name="variantName"
              value={variant.variantName}
              required
              onChange={(e) => {
                handleVariantsChange(index, e.target.name, e.target.value);
              }}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              name="price"
              min={1}
              value={variant.price}
              required
              onChange={(e) => {
                handleVariantsChange(index, e.target.name, e.target.value);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              handleDelete(index);
            }}
          >
            X
          </button>
        </div>
      ))}
      <button type="button" onClick={addVariant}>
        Añadir Variante...
      </button>
      <button
        type="submit"
        onClick={(e) => {
          handleSave(e);
        }}
      >
        Guardar
      </button>
      <button
        type="button"
        onClick={() => {
          onExit(false);
        }}
      >
        X
      </button>
    </form>
  );
}
