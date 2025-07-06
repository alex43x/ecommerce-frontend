import React, { useState, useEffect, useRef } from "react";

export default function Dropdown({
  items,
  selected,
  onSelect,
  placeholder = "Seleccionar",
}) {
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", zIndex:11 }}>
      <button
        className=" px-2 py-2 text-green-800 bg-green-200 border border-green-800 hover:bg-green-300 transition flex gap-2"
        onClick={() => setOpen(!open)}
      >
        {selected?.label || placeholder}
        {selected.icon && (
          <img className="w-4 object-contain" src={selected?.icon} alt="" />
        )}
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
          className="rounded w-40"
        >
          {items.map((item) => (
            <li
              key={item.value}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className="bg-neutral-50 hover:bg-green-200 p-2 text-green-800  border-b-2 border-b-neutral-200 flex gap-2"
            >
              {item.label}
              {item.icon && (
                <img className="w-4 object-contain" src={item.icon} alt="" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
