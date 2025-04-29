import React, { useState } from "react";
import { ProductContext } from "./ProductContext";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchedProducts, setFetchedProducts] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState(false);
  const token = localStorage.getItem("AuthToken");

  const getProducts = async ({
    page = 1,
    limit = 10,
    category = null,
    search = null,
    sortBy = null,
    forceRefresh = false,
  }) => {
    if (fetchedProducts && !forceRefresh) return;
    setLoading(true);
    console.log(limit)
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
      setProducts(data.products);
      setPage(data.currentPage);
      setTotalPages(data.totalPages)
      setFetchedProducts(true);
      //console.log(data.products);
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

  const createProduct = async (product) => {
    console.log(product);
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
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === _id ? { ...p, ...rest } : p))
      );
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
      console.log(data);
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
    console.log(category);
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
    console.log(category);
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
    console.log("a", _id);
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
      setLoading(true);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        categories,
        page,
        setPage,
        totalPages,
        loading,
        getProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
