import React, { useState } from "react";
import { ProductContext } from "./ProductContext";
export const ProductProvider = ({ children }) => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchedCategories, setFetchedCategories] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState({});
  const token = localStorage.getItem("AuthToken");

  const getProducts = async ({
    page = 1,
    limit = 10,
    category = "general",
    search = null,
    sortBy = null,
    forceRefresh = false,
  }) => {
    const currentParams = { page, limit, category, search, sortBy };

    if (
      !forceRefresh &&
      lastFetchParams[category] &&
      JSON.stringify(currentParams) ===
        JSON.stringify(lastFetchParams[category])
    ) {
      return {
        products: productsByCategory[category] || [],
        totalPages,
        currentPage: page,
      };
    }

    setLoading(true);

    const queryParams = {
      page,
      limit,
      ...(category && { category }),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
    };

    const params = new URLSearchParams(queryParams);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);

      setProductsByCategory((prev) => ({
        ...prev,
        [category]: data.products,
      }));
      setPage(data.currentPage);
      setTotalPages(data.totalPages);

      setLastFetchParams((prev) => ({
        ...prev,
        [category]: currentParams,
      }));

      // ✅ Este return permite usar los productos en componentes como Foods
      return {
        products: data.products,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      };
    } catch (e) {
      console.error(e);
      throw e;
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
      console.log(data);
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
      setCategories(data);
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
