import React, { useEffect } from "react";
import ProductContainer from "./ProductContainer";
import { useProduct } from "../../context/product/ProductContext";

export default function Drinks() {
  const { getProducts, productsByCategory } = useProduct();
  const category = "Bebidas";

  useEffect(() => {
    if (!productsByCategory[category]) {
      getProducts({ page: 1, limit: 7, category });
    }
  }, [category]);

  const foods = productsByCategory[category];

  if (!foods) return <p>Cargando productos...</p>;

  return (
    <div>
      {foods.map((product) => (
        <ProductContainer key={product._id} product={product} />
      ))}
    </div>
  );
}
