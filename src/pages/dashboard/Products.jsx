import React, { useEffect, useState } from "react";
import { useProduct } from "../../context/product/ProductContext";
import ProductTable from "../../components/dashboard/ProductTable";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import NewProductForm from "../../components/dashboard/NewProductForm";
import CategoriesDropdown from "../../components/dashboard/categoriesDropdown";

export default function Products() {
  const {
    getProducts,
    updateProduct,
    deleteProduct,
    products,
    categories,
    loading,
    getCategories,
    page,
    setPage,
    totalPages,
  } = useProduct();

  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addProduct, setAddProduct] = useState(false);
  const [addCategory, setAddCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProducts({ page: page, limit: 10,forceRefresh:true });
        await getCategories();
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, []);


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
        <CategoriesDropdown onExit={() => setAddCategory(false)} />
      </ProductFormModal>
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
          getProducts({ page: page, limit: 10, forceRefresh: true })
        }
      />
      <button
        disabled={page ==1}
        onClick={() => {
          setPage(page - 1);
        }}
      >
        Anterior
      </button>
      <span>{page}</span>
      <button
        disabled={page == totalPages}
        onClick={() => {
          setPage(Number(page) + 1);
        }}
      >
        Siguiente
      </button>
    </div>
  );
}
