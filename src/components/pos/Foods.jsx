import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";
import { useProduct } from "../../context/product/ProductContext";

export default function Foods({ categories }) {
  const { getProducts, productsByCategory } = useProduct();
  const [category, setCategory] = useState("noBebidas");

  useEffect(() => {
    if (!productsByCategory[category]) {
      getProducts({ page: 1, limit: 7, category });
    }
  }, [category]);

  const foods = productsByCategory[category];

  if (!foods) return <p>Cargando productos...</p>;

  return (
    <div>
      <button onClick={() => setCategory(null)}>Todos</button>
      {categories
        ?.filter((cat) => cat.name.toLowerCase() !== "bebidas")
        .map((cat) => (
          <button
            onClick={() => {
              setCategory(cat.name);
            }}
            key={cat._id}
          >
            {cat.name}
          </button>
        ))}

      {foods.map((product) => (
        <ProductContainer key={product._id} product={product} />
      ))}
    </div>
  );
}
