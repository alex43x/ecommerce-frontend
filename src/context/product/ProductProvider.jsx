import React, { useState } from "react";
import { ProductContext } from "./ProductContext";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const token=localStorage.getItem("AuthToken")

  const getProducts = async ({page=1, limit=10, category=null, search=null, sortBy=null}) => {
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
          headers: { "Content-Type": "application/json" ,Authorization:`Bearer ${token}`},
        }
      );
      const data = await res.json();
      setProducts(data.products);
      setPage(data.currentPage);
      console.log(data.products)
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );
      const data = await res.json();
      setProduct(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product) => {
    //testear si agarra sin el parametro de id
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        page,
        loading,
        getProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
