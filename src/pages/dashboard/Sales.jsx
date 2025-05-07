import React,{useEffect} from "react";
import { useSale } from "../../context/sale/SaleContext";

export default function Sales() {
  const { getSales,page, sales, loading } = useSale();
  useEffect(() => {
    getSales(1, 10);
  }, []);

  return(
    <div>
        {loading ? (
        <p>Cargando...</p>
      ) : (
        sales.map((sale) => <p key={sale._id}> monto:{(sale.totalAmount).toFixed()} </p>)
      )}
    </div>
  )
}
