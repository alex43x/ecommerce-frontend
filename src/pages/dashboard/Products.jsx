import React, { useEffect, useState } from "react";
import { useProduct } from "../../context/product/ProductContext";
import ProductTable from "../../components/dashboard/ProductTable";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import NewProductForm from "../../components/dashboard/NewProductForm";

export default function Products() {
  const {
    getProducts,
    updateProduct,
    deleteProduct,
    products,
    categories,
    loading,
    getCategories,
  } = useProduct();

  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addProduct, setAddProduct] = useState(false);

  useEffect(() => {
    getProducts({ page: 1, limit: 10 });
    getCategories();
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
          getProducts({ page: 1, limit: 10, forceRefresh: true })
        }
      />
    </div>
  );
}
