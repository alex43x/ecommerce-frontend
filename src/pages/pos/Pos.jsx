import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import PosTabs from "../../components/pos/PosTabs";
import OrderView from "../../components/pos/OrderView";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import OrderDetail from "../../components/pos/OrderConfirm";
export default function POS() {
  const { logout } = useAuth();
  const [confirmOrder, setConfirmOrder] = useState(false);
  return (
    <div>
      <h1>POS</h1>
      <button
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesión
      </button>
      <OrderView onConfirm={()=>{setConfirmOrder(true)}}></OrderView>
      <ProductFormModal
        isOpen={confirmOrder}
        onClose={() => {
          setConfirmOrder(false);
        }}
      >
        <OrderDetail onExit={() => setConfirmOrder(false)}></OrderDetail>
      </ProductFormModal>
      <PosTabs></PosTabs>
    </div>
  );
}
