import React, { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";
import { useReport } from "../../../context/report/ReportContext";
import eliminar from "../../../images/eliminar.png";

export default function ProductVariantSelector({
  selectedVariants,
  setSelectedVariants,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [suggestions, setSuggestions] = useState([]);
  const { searchProductVariants } = useReport();
  const containerRef = useRef();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm) {
        const results = await searchProductVariants(debouncedSearchTerm);
        // filtrar los que ya están seleccionados
        console.log(results)
        const filtered = results.data.filter(
          (variant) =>
            !selectedVariants.some((v) => v.variantId === variant.variantId)
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm, searchProductVariants, selectedVariants]);

  const handleSelect = (variant) => {
    if (
      !selectedVariants.find((v) => v.variantId === variant.variantId) &&
      selectedVariants.length < 5
    ) {
      setSelectedVariants([...selectedVariants, variant]);
    }
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleRemove = (variantId) => {
    setSelectedVariants(
      selectedVariants.filter((v) => v.variantId !== variantId)
    );
  };

  // Cierra el dropdown si se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} className="relative w-full max-w-md">
        <input
          type="text"
          className="w-8/12 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Buscar Producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-8/12 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
            {suggestions.map((variant) => (
              <li
                key={variant.variantId}
                onClick={() => handleSelect(variant)}
                className="px-3 py-2 hover:bg-green-200 cursor-pointer text-green-800"
              >
                {variant.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3 ">
        {selectedVariants.map((variant) => (
          <div
            key={variant.variantId}
            className="flex items-center px-2 py-1 bg-green-200 border border-green-900 rounded-lg hover:bg-green-300"
          >
            <span className="mr-2 font-medium">{variant.name}</span>
            <button onClick={() => handleRemove(variant.variantId)}>
              <img
                className="w-4 h-4 object-contain"
                src={eliminar}
                alt="Eliminar"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
