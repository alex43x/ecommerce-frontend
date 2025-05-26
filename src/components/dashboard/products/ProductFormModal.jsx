import React from "react";
import ReactDOM from "react-dom";

export default function ProductFormModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem", // para que no quede pegado a los bordes
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#edefee",
          padding: "20px",
          borderRadius: "10px",
          minWidth: "300px",
          
          maxWidth: "800px",
          maxHeight: "90vh", // limita altura del modal
          overflowY: "auto", // permite scroll si es necesario
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
