import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useProduct } from "../../context/product/ProductContext";
import ProductTable from "../../components/dashboard/ProductTable";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import NewProductForm from "../../components/dashboard/NewProductForm";
import CategoriesMenu from "../../components/dashboard/CategoriesMenu";
import Dropdown from "../../components/dashboard/FilterDropdown";

export default function Products() {
  const {
    getProducts,
    updateProduct,
    deleteProduct,
    categories,
    loading,
    getCategories,
    productsByCategory,
  } = useProduct();
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    sortBy: "dateDesc",
    category: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    getProducts({ ...filters, limit: 15 }).then((res) => {
      setTotalPages(res.totalPages || 1);
    });
  }, [filters]);

  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addProduct, setAddProduct] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const currentProducts = productsByCategory[filters.category] || [];
  const sortOptions = [
    { label: "Más Reciente", value: "dateDesc" },
    { label: "Más Antiguo", value: "dateAsc" },
    { label: "Mayor Precio", value: "priceDesc" },
    { label: "Menor Precio ", value: "priceAsc" },
    { label: "A-Z", value: "nameAsc" },
    { label: "Z-A", value: "nameDesc" },
  ];

  const categoryOptions = [
    { label: "Todas las categorías", value: "" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.name,
    })),
  ];

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts({ ...filters, limit: 15 });
  }, [filters]);

  useEffect(() => {
    const delayedSearch = debounce(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchInput]);

  return (
    <div>
      {/* Filtros junto a los tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Aquí ya no necesitas los botones de tab */}

        <input
          type="text"
          className="border px-2 py-1 rounded-lg"
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
        />

        <Dropdown
          items={sortOptions}
          selected={sortOptions.find((opt) => opt.value === filters.sortBy)}
          onSelect={(option) =>
            setFilters((f) => ({ ...f, sortBy: option.value, page: 1 }))
          }
          placeholder="Ordenar por"
        />

        <button
          style={{ border: "1px solid #e0e0e0" }}
          className="bg-white px-2 py-1"
          onClick={() => setAddProduct(true)}
        >
          Agregar Producto
        </button>
        <ProductFormModal
          isOpen={addProduct}
          onClose={() => setAddProduct(false)}
        >
          <NewProductForm onExit={() => setAddProduct(false)} />
        </ProductFormModal>

        <button
          style={{ border: "1px solid #e0e0e0" }}
          className="bg-white px-2 py-1"
          onClick={() => setAddCategory(true)}
        >
          Categorías
        </button>
        <ProductFormModal
          isOpen={addCategory}
          onClose={() => setAddCategory(false)}
        >
          <CategoriesMenu onExit={() => setAddCategory(false)} />
        </ProductFormModal>
      </div>

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
        refreshProducts={() =>
          getProducts({ ...filters, limit: 15, forceRefresh: true })
        }
      />

      <button
        disabled={filters.page === 1}
        onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
      >
        Anterior
      </button>
      <span>{filters.page}</span>
      <button
        disabled={filters.page === totalPages}
        onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
      >
        Siguiente
      </button>
    </div>
  );
}
