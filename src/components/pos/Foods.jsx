import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";
import { useProduct } from "../../context/product/ProductContext";
import { useCart } from "../../context/cart/CartContext";

export default function Foods({ categories }) {
  const { getProducts, productsByCategory, getProductByBarcode, product } =
    useProduct();
  const { addToCart, cart } = useCart();
  const [category, setCategory] = useState("noBebidas");
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    if (!productsByCategory[category]) {
      getProducts({ page: 1, limit: 7, category });
    }
  }, [category]);

  useEffect(() => {
    if (product) {
      console.log(product);
      const variantObj = product.variants;

      const productFormatted = {
        ...product,
        variants: [variantObj], // 👉 importante: lo convertimos en array
      };

      const foundInCart = cart.find(
        (item) => item.productId === variantObj._id
      );
      const quantity = foundInCart ? foundInCart.quantity : 0;

      const formattedVariant = {
        ...variantObj,
        quantity,
        index: 0,
      };

      addToCart({
        product: productFormatted,
        variant: formattedVariant,
        quantity: 1,
      });
    }
  }, [product]);

  const foods = productsByCategory[category];
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getProductByBarcode(barcode);
      setBarcode("");
    }
  };

  if (!foods) return <p>Cargando productos...</p>;

  return (
    <div>
      <button onClick={() => setCategory(null)}>Todos</button>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleKeyDown}
      />

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
