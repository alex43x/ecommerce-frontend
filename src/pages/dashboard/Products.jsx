import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useProduct } from "../../context/product/ProductContext";
import ProductTable from "../../components/dashboard/products/ProductTable";
import ProductFormModal from "../../components/dashboard/products/ProductFormModal";
import NewProductForm from "../../components/dashboard/products/NewProductForm";
import CategoriesMenu from "../../components/dashboard/products/CategoriesMenu";
import Dropdown from "../../components/dashboard/products/FilterDropdown";

import anadir from "../../images/anadir.png";
import editar from "../../images/editar.png";
import az from "../../images/a-z.png";
import za from "../../images/z-a.png";
import calendario from "../../images/calendario.png";
import precio from "../../images/precio.png";

export default function Products() {
  const {
    getProducts,
    updateProduct,
    deleteProduct,
    categories,
    loading,
    getCategories,
    productsByCategory = {},
    totalPagesByCategory = {},
  } = useProduct();

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    sortBy: "dateDesc",
    category: "",
  });

  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addProduct, setAddProduct] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Generar clave de caché basada en los filtros actuales
  const cacheKey = `${filters.category || ""}-${filters.search || ""}-${
    filters.sortBy || "dateDesc"
  }`;

  // Obtener datos con valores por defecto seguros
  const totalPages = totalPagesByCategory[cacheKey] || 1;
  const currentProducts = productsByCategory[cacheKey] || [];

  // Función optimizada para cargar productos
  const loadProducts = useCallback(async () => {
    try {
      await getProducts({ ...filters, limit: 15 });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [filters, getProducts]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Efecto principal para cargar productos cuando cambian los filtros
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  useEffect(() => {
    console.log(productsByCategory, totalPagesByCategory);
  }, [productsByCategory, totalPagesByCategory]);

  // Búsqueda con debounce
  useEffect(() => {
    const delayedSearch = debounce(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchInput]);

  const sortOptions = [
    { label: "Más Reciente", value: "dateDesc", icon: calendario },
    { label: "Más Antiguo", value: "dateAsc", icon: calendario },
    { label: "Mayor Precio", value: "priceDesc", icon: precio },
    { label: "Menor Precio", value: "priceAsc", icon: precio },
    { label: "A-Z", value: "nameAsc", icon: az },
    { label: "Z-A", value: "nameDesc", icon: za },
  ];

  const categoryOptions = [
    { label: "Todas las categorías", value: "" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
  ];

  return (
    <div className="">
      {/* Encabezado y Filtros */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-neutral-100 p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <h3 className="text-green-800 text-lg font-semibold">Buscar: </h3>
          <input
            type="text"
            className="border-2 px-3 py-2 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Buscar producto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <Dropdown
            items={categoryOptions}
            selected={categoryOptions.find(
              (opt) => opt.value === filters.category
            )}
            onSelect={(option) =>
              setFilters((f) => ({ ...f, category: option.value, page: 1 }))
            }
            placeholder="Por categoría"
            className="min-w-[200px]"
          />

          <Dropdown
            items={sortOptions}
            selected={sortOptions.find((opt) => opt.value === filters.sortBy)}
            onSelect={(option) =>
              setFilters((f) => ({ ...f, sortBy: option.value, page: 1 }))
            }
            placeholder="Ordenar por"
            className="min-w-[180px]"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <h3 className="text-green-800 text-lg font-semibold">Acciones: </h3>
          <button
            className="bg-green-200 border border-green-800 text-green-800 px-3 py-2 flex gap-2 items-center hover:bg-green-300 transition rounded-lg shadow-sm"
            onClick={() => setAddProduct(true)}
          >
            <img
              className="w-5 h-5 object-contain"
              src={anadir}
              alt="Agregar"
            />
            <span>Agregar Producto</span>
          </button>

          <button
            className="bg-green-200 border border-green-800 text-green-800 px-3 py-2 flex gap-2 items-center hover:bg-green-300 transition rounded-lg shadow-sm"
            onClick={() => setAddCategory(true)}
          >
            <img className="w-5 h-5 object-contain" src={editar} alt="Editar" />
            <span>Ver Categorías</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="">
        {loading ? (
          <div className="text-center py-8 text-green-700">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-2"></div>
            <p>Cargando productos...</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <>
            <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200">
              <ProductTable
                products={currentProducts}
                loading={loading}
                categories={categories}
                editProductId={editProductId}
                setEditProductId={setEditProductId}
                editForm={editForm}
                setEditForm={setEditForm}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                refreshProducts={() => {
                  getProducts({
                    page: 1,
                    limit: 10,
                    category: "",
                    search: "",
                    sortBy: "dateDesc",
                    forceRefresh: true,
                  });
                  setFilters({
                    page: 1,
                    search: "",
                    sortBy: "dateDesc",
                    category: "",
                  });
                }}
              />
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-6 gap-4 items-center">
              <button
                disabled={filters.page === 1 || loading}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className={`px-4 py-2 rounded-lg ${
                  filters.page === 1 || loading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-200 text-green-800 hover:bg-green-300"
                } border border-green-800 transition`}
              >
                Anterior
              </button>
              <span className="text-green-800 font-medium">
                Página {filters.page} de {totalPagesByCategory[cacheKey]}
              </span>
              <button
                disabled={filters.page >= totalPages || loading}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className={`px-4 py-2 rounded-lg ${
                  filters.page >= totalPages || loading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-200 text-green-800 hover:bg-green-300"
                } border border-green-800 transition`}
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-medium text-gray-600 mb-2">
              {filters.search
                ? "No se encontraron productos con ese nombre"
                : filters.category
                ? "No hay productos en esta categoría"
                : "No hay productos disponibles"}
            </p>
            {filters.search || filters.category ? (
              <button
                onClick={() => {
                  setFilters({
                    page: 1,
                    search: "",
                    sortBy: "dateDesc",
                    category: "",
                  });
                  setSearchInput("");
                }}
                className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Modales */}
      <ProductFormModal
        isOpen={addProduct}
        onClose={() => setAddProduct(false)}
        title="Agregar Nuevo Producto"
      >
        <NewProductForm
          onExit={() => {
            setAddProduct(false);
            loadProducts();
          }}
        />
      </ProductFormModal>

      <ProductFormModal
        isOpen={addCategory}
        onClose={() => setAddCategory(false)}
        title="Administrar Categorías"
        size="lg"
      >
        <CategoriesMenu
          onExit={() => {
            setAddCategory(false);
            getCategories();
          }}
        />
      </ProductFormModal>
    </div>
  );
}
