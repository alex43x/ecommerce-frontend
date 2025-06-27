import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";
import { useProduct } from "../../context/product/ProductContext";
import { useCart } from "../../context/cart/CartContext";
import { debounce } from "lodash";
import Swal from "sweetalert2";

export default function Drinks() {
  const {
    getProducts,
    productsByCategory,
    getProductByBarcode,
    product,
    clearProduct,
  } = useProduct();
  const { addToCart, cart } = useCart();

  const category = "Bebidas";
  const [searchInput, setSearchInput] = useState("");
  const [barcode, setBarcode] = useState("");
  const [triggeredByScan, setTriggeredByScan] = useState(false);
  useEffect(() => {
    if (!productsByCategory[category]) {
      getProducts({ page: 1, limit: 24, category, search: searchInput });
    }
  }, [category]);

  useEffect(() => {
    if (!triggeredByScan) return;

    if (product && !product.message) {
      const variantObj = product.variants;

      const productFormatted = {
        ...product,
        variants: [variantObj],
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
    } else if (product?.message) {
      Swal.fire({
        icon: "error",
        title: "No encontrado",
        text: "No existe producto con ese código",
        confirmButtonColor: "#057c37",
      });
    }

    setTriggeredByScan(false);
    clearProduct(); // ✅ limpia producto
  }, [product]);

  useEffect(() => {
    const delayedSearch = debounce(() => {
      getProducts({ page: 1, limit: 24, category, search: searchInput });
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchInput]);

  const foods = productsByCategory[category];
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getProductByBarcode(barcode);
      setTriggeredByScan(true); // 👉 esta línea es crucial
      setBarcode("");
    }
  };

  if (!foods) return <p>Cargando productos...</p>;

  return (
    <div>
      <section className="flex mt-4 gap-2 items-center">
        <p className="font-medium text-xl">Buscar:</p>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            className=" px-2 py-1 rounded-lg bg-neutral-50 w-7/12"
            placeholder="Buscar producto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <input
            type="text"
            className="px-2 py-1 rounded-lg bg-neutral-50"
            placeholder="Código de Barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 my-3">
        {foods.map((product) => (
          <ProductContainer key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
