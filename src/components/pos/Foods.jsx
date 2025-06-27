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
  const [pagesByCategory, setPagesByCategory] = useState({ noBebidas: 1 });
  const [totalPagesByLocal, setTotalPagesByLocal] = useState({ noBebidas: 1 });

  const currentPage = pagesByCategory[category] || 1;
  const totalPages = totalPagesByLocal[category] || 1;
  const limit = 27;

  const foods = productsByCategory[category];

  const fetchProducts = async ({ page, search }) => {
    const res = await getProducts({
      page,
      limit,
      category,
      search,
    });

    // si `getProducts` devuelve directamente `res.data`:
    if (res?.totalPages) {
      setTotalPagesByLocal((prev) => ({
        ...prev,
        [category]: Number(res.totalPages),
      }));
    }
  };

  useEffect(() => {
    fetchProducts({ page: currentPage, search: searchInput });
  }, [category, currentPage]);

  useEffect(() => {
    const delayedSearch = debounce(() => {
      setPagesByCategory((prev) => ({ ...prev, [category]: 1 }));
      fetchProducts({ page: 1, search: searchInput });
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchInput]);

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
    clearProduct();
  }, [product]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getProductByBarcode(barcode);
      setTriggeredByScan(true);
      setBarcode("");
    }
  };

  if (!foods) return <p>Cargando productos...</p>;

  return (
    <div>
      {/* Búsqueda */}
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

      {/* Categorías */}
      <section className="w-full overflow-x-auto my-2">
        <div className="flex gap-2 w-max px-1">
          <button
            className={` border border-green-900 rounded-lg px-4 py-2 whitespace-nowrap text-green-800 ${
              category == "noBebidas" ? "bg-green-300" : "bg-green-100"
            }`}
            onClick={() => {
              setCategory("noBebidas");
              if (!pagesByCategory["noBebidas"]) {
                setPagesByCategory((prev) => ({ ...prev, noBebidas: 1 }));
              }
            }}
          >
            Todos
          </button>
          {categories
            ?.filter((cat) => cat.name.toLowerCase() !== "bebidas")
            .map((cat) => (
              <button
                key={cat._id}
                className={` border border-green-900 rounded-lg px-4 py-2 whitespace-nowrap text-green-800  ${
                  category == cat.name ? "bg-green-300" : "bg-green-100"
                }`}
                onClick={() => {
                  setCategory(cat.name);
                  if (!pagesByCategory[cat.name]) {
                    setPagesByCategory((prev) => ({
                      ...prev,
                      [cat.name]: 1,
                    }));
                  }
                }}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </section>

      {/* Productos */}
      <section className="grid grid-cols-3 gap-3">
        {foods.map((product) => (
          <ProductContainer key={product._id} product={product} />
        ))}
      </section>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            className=" bg-green-200 rounded text-green-800 border border-green-800 active:bg-green-300"
            disabled={currentPage === 1}
            onClick={() =>
              setPagesByCategory((prev) => ({
                ...prev,
                [category]: currentPage - 1,
              }))
            }
          >
            Anterior
          </button>
          <span className="text-lg font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className=" bg-green-200 rounded text-green-800 border border-green-800 active:bg-green-300"
            disabled={currentPage === totalPages}
            onClick={() =>
              setPagesByCategory((prev) => ({
                ...prev,
                [category]: currentPage + 1,
              }))
            }
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
