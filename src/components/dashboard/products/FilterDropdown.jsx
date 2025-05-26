import React, { useState, useEffect, useRef } from "react";

export default function Dropdown({ items, selected, onSelect, placeholder = "Seleccionar" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button style={{border: "1px solid #e0e0e0"}} className="bg-white px-1 py-1 " onClick={() => setOpen(!open)}>
        {selected?.label || placeholder} ⌄
      </button>

      {open && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            border: "1px solid #e0e0e0",
            listStyle: "none",
            padding: 0,
            margin: 0,
            zIndex: 10,
          }}
        >
          {items.map((item) => (
            <li
              key={item.value}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              style={{
                padding: "8px",
                cursor: "pointer",
                background: selected?.value === item.value ? "#eee" : "transparent",
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
