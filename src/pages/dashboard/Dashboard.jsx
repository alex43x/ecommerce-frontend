import React, { useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useProduct } from "../../context/product/ProductContext";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const { getProducts, products, loading } = useProduct();
  useEffect(() => {
    getProducts(1,10);
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hola, {user.name}</p>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        products.map((product) => <p>{product.name} {product.price} </p>)
      )}
      <button
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
