import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";
import Swal from "sweetalert2";
import { useProduct } from "../../context/product/ProductContext";
import { useCart } from "../../context/cart/CartContext";
import { debounce } from "lodash";
export default function Foods({ categories }) {
  const {
    getProducts,
    productsByCategory,
    getProductByBarcode,
    product,
    clearProduct,
  } = useProduct();
  const { addToCart, cart } = useCart();
  const [category, setCategory] = useState("noBebidas");
  const [barcode, setBarcode] = useState("");
  const [triggeredByScan, setTriggeredByScan] = useState(false);
  const [searchInput, setSearchInput] = useState("");
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
      confirmButtonColor: "#166534",
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
      {/*Búsquedas*/}
      <section className="flex mt-2 gap-2 items-center">
        <p className="font-medium text-xl">Buscar:</p>
        <input
          type="text"
          className="border px-2 py-1 rounded-lg"
          placeholder="Buscar producto..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <input
          type="text"
          className="px-2 py-1"
          placeholder="Código de Barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </section>
      {/*Categorias*/}
      <section className="w-full overflow-x-auto my-2">
        <div className="flex gap-2 w-max px-1">
          <button
            className="bg-green-200 border border-green-900 rounded-xl px-3 py-1 whitespace-nowrap text-green-800"
            onClick={() => setCategory("noBebidas")}
          >
            Todos
          </button>
          {categories
            ?.filter((cat) => cat.name.toLowerCase() !== "bebidas")
            .map((cat) => (
              <button
                key={cat._id}
                className="bg-green-200 border border-green-900 rounded-xl px-3 py-1 whitespace-nowrap text-green-800"
                onClick={() => setCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {foods.map((product) => (
          <ProductContainer key={product._id} product={product} />
        ))}
      </section>
    </div>
  );
}
