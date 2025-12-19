// ProductProvider.jsx
import React, { useState } from "react";
import { ProductContext } from "./ProductContext";
import { useAuth } from "../auth/AuthContext";

export const ProductProvider = ({ children }) => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [totalPagesByCategory, setTotalPagesByCategory] = useState({});
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchedCategories, setFetchedCategories] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState({});

  const { logout } = useAuth();

  // Obtener headers con token
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
  });

  // Manejo de respuestas no autorizadas
  const handleUnauthorized = (res) => {
    if (res.status === 401) {
      logout();
      throw new Error("Token inválido o expirado");
    }
  };

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

    if (
      !forceRefresh &&
      lastFetchParams[cacheKey] &&
      lastFetchParams[cacheKey].page === page &&
      JSON.stringify(currentParams) === JSON.stringify(lastFetchParams[cacheKey]) &&
      category !== "Desayuno"
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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products?${queryParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      handleUnauthorized(res);

      const data = await res.json();

      setProductsByCategory((prev) => ({
        ...prev,
        [cacheKey]: data.data || [],
      }));

      setTotalPagesByCategory((prev) => ({
        ...prev,
        [cacheKey]: data.totalPages || 1,
      }));

      setPage(data.currentPage || page);
      setLastFetchParams((prev) => ({ ...prev, [cacheKey]: currentParams }));

      return {
        products: data.data || [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || page,
      };
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
        loading,
        clearProduct: () => setProduct(null),
        getProducts,
        getProductById: async (id) => {
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
              method: "GET",
              headers: getAuthHeaders(),
            });
            handleUnauthorized(res);
            const data = await res.json();
            setProduct(data);
          } finally {
            setLoading(false);
          }
        },
        createProduct: async (product) => {
          setLoading(true);
          try {
            const bodyWithIva = { ...product, iva: product.iva || "10%" };
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(bodyWithIva),
            });
            handleUnauthorized(res);
            return await res.json();
          } finally {
            setLoading(false);
          }
        },
        updateProduct: async ({ _id, ...rest }) => {
          setLoading(true);
          try {
            const bodyWithIva = { ...rest, iva: rest.iva || "10%" };
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${_id}`, {
              method: "PUT",
              headers: getAuthHeaders(),
              body: JSON.stringify(bodyWithIva),
            });
            handleUnauthorized(res);
            return await res.json();
          } finally {
            setLoading(false);
          }
        },
        deleteProduct: async (id) => {
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
              method: "DELETE",
              headers: getAuthHeaders(),
            });
            handleUnauthorized(res);
            return await res.json();
          } finally {
            setLoading(false);
          }
        },
        getCategories: async (force = false) => {
          if (fetchedCategories && !force) return;
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
              method: "GET",
              headers: getAuthHeaders(),
            });
            handleUnauthorized(res);
            const data = await res.json();
            setCategories(data.data);
            setFetchedCategories(true);
          } finally {
            setLoading(false);
          }
        },
        createCategory: async (category = {}) => {
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(category),
            });
            handleUnauthorized(res);
            return await res.json();
          } finally {
            setLoading(false);
          }
        },
        updateCategory: async ({ _id, ...rest }) => {
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${_id}`, {
              method: "PUT",
              headers: getAuthHeaders(),
              body: JSON.stringify(rest),
            });
            handleUnauthorized(res);
            return await res.json();
          } finally {
            setLoading(false);
          }
        },
        deleteCategory: async (_id) => {
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${_id}`, {
              method: "DELETE",
              headers: getAuthHeaders(),
            });
            handleUnauthorized(res);
            return await res.json();
          } finally {
            setLoading(false);
          }
        },
        getProductByBarcode: async (barcode) => {
          setLoading(true);
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/barcode/${barcode}`, {
              method: "GET",
              headers: getAuthHeaders(),
            });
            handleUnauthorized(res);
            const data = await res.json();
            setProduct(data.data);
          } finally {
            setLoading(false);
          }
        },
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
