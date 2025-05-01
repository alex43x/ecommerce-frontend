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
    products,
    categories,
    loading,
    getCategories,
    totalPages,
  } = useProduct();

  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addProduct, setAddProduct] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const sortOptions = [
    { label: "Fecha ↓", value: "dateDesc" },
    { label: "Fecha ↑", value: "dateAsc" },
    { label: "Precio ↓", value: "priceDesc" },
    { label: "Precio ↑", value: "priceAsc" },
    { label: "Nombre A-Z", value: "nameAsc" },
    { label: "Nombre Z-A", value: "nameDesc" },
  ];
  const categoryOptions = [
    { label: "Todas las categorías", value: "" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.name,
    })),
  ];

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    sortBy: "dateDesc",
    category: "",
  });

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts({ ...filters, limit: 15 });
  }, [filters]);

  // 🔹 Debounce del input de búsqueda
  useEffect(() => {
    const delayedSearch = debounce(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchInput]);

  return (
    <div>
      <button onClick={() => setAddProduct(true)}>Agregar producto</button>
      <ProductFormModal
        isOpen={addProduct}
        onClose={() => setAddProduct(false)}
      >
        <NewProductForm onExit={() => setAddProduct(false)} />
      </ProductFormModal>

      <button onClick={() => setAddCategory(true)}>Categorías...</button>
      <ProductFormModal
        isOpen={addCategory}
        onClose={() => setAddCategory(false)}
      >
        <CategoriesMenu onExit={() => setAddCategory(false)} />
      </ProductFormModal>

      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Dropdown
        items={categoryOptions}
        selected={categoryOptions.find((opt) => opt.value === filters.category)}
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

      <ProductTable
        products={products}
        loading={loading}
        categories={categories}
        editProductId={editProductId}
        setEditProductId={setEditProductId}
        editForm={editForm}
        setEditForm={setEditForm}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        refreshProducts={() =>
          getProducts({ ...filters, limit: 10, forceRefresh: true })
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
