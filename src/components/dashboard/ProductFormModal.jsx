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
      }}
      onClick={onClose} // Cierra si clickeas afuera
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          minWidth: "300px",
          maxWidth: "90%",
        }}
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al clickear adentro
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

