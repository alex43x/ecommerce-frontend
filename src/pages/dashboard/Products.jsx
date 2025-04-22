import React,{useEffect} from "react";
import { useProduct } from "../../context/product/ProductContext";

export default function Products() {
  const { getProducts, products, loading } = useProduct();
  useEffect(() => {
    getProducts(1, 10);
  }, []);

  return(
    <div>
        {loading ? (
        <p>Cargando...</p>
      ) : (
        products.map((product) => <p>{product.name} {product.price} </p>)
      )}
    </div>
  )
}
