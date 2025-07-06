import React, { useState } from "react";
import { ProductContext } from "./ProductContext";
export const ProductProvider = ({ children }) => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [totalPagesByCategory, setTotalPagesByCategory] = useState({});
  const [product, setProduct] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchedCategories, setFetchedCategories] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState({});
  const token = localStorage.getItem("AuthToken");

  const getProducts = async ({
    page = 1,
    limit = 10,
    category = "",
    search = null,
    sortBy = "dateDesc",
    forceRefresh = false,
  }) => {
    const cacheKey = `${category}-${search}-${sortBy}`;
    const currentParams = { page, limit, category, search, sortBy };

    // Verificación de caché más inteligente
    if (
      !forceRefresh &&
      lastFetchParams[cacheKey] &&
      lastFetchParams[cacheKey].page === page &&
      JSON.stringify(currentParams) ===
        JSON.stringify(lastFetchParams[cacheKey])
    ) {
      return {
        products: productsByCategory[cacheKey] || [],
        totalPages: totalPagesByCategory[cacheKey] || 1,
        currentPage: page,
      };
    }

    setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category && { category }),
        ...(search && { search }),
        ...(sortBy && { sortBy }),
      });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/products?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Create new objects for state updates
      const newProductsByCategory = {
        ...productsByCategory,
        [cacheKey]: data.data || data.products || [],
      };
      console.log(data.totalPages);
      setTotalPagesByCategory((prev) => {
        const newState = {
          ...prev,
          [cacheKey]: data.totalPages || 1,
        };
        console.log("Actualizando totalPages:", newState); // Para depuración
        return newState;
      });

      // Batch state updates
      setProductsByCategory(newProductsByCategory);

      setPage(data.currentPage || page);
      setLastFetchParams((prev) => ({
        ...prev,
        [cacheKey]: currentParams,
      }));

      // Return the data we just received, not from state
      return {
        products: data.data || data.products || [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || page,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setProduct(data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getProductByBarcode = async (barcode) => {
    setLoading(true);
    console.log(barcode);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/barcode/${barcode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const product = await res.json();
      if (product) {
        setProduct(product);
      } else {
        alert("Producto no encontrado");
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const clearProduct = () => setProduct(null);

  const createProduct = async (product) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      console.log("Producto creado:", data);

      const categoriesToUpdate =
        product.category.length > 0 ? product.category : [""];

      for (const cat of categoriesToUpdate) {
        setLastFetchParams((prev) => ({
          ...prev,
          [cat]: {},
        }));

        const { products } = await getProducts({
          page: 1,
          limit: 10,
          category: cat,
          forceRefresh: true,
        });

        setProductsByCategory((prev) => ({
          ...prev,
          [cat]: products,
        }));
      }

      // También actualizar la vista general sin categoría
      const generalProducts = await getProducts({
        page: 1,
        limit: 10,
        category: "",
        forceRefresh: true,
      });

      setProductsByCategory((prev) => ({
        ...prev,
        [""]: generalProducts.products,
      }));
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product) => {
    setLoading(true);
    const { _id, ...rest } = product;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rest),
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async (forceRefresh = false) => {
    if (fetchedCategories && !forceRefresh) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setCategories(data.data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
      setFetchedCategories(true);
    }
  };

  const createCategory = async (category = {}) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (category) => {
    setLoading(true);
    const { _id, ...rest } = category;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rest),
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (_id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/${_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        productsByCategory,
        totalPagesByCategory,
        product,
        categories,
        page,
        setPage,
        totalPages,
        loading,
        clearProduct,
        getProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        getProductByBarcode,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
