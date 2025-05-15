// ProductVariantSelector.jsx
import React, { useState, useEffect } from 'react';
import useDebounce from './useDebounce'; // Asegúrate de tener este hook implementado
import { useReport } from '../../../context/report/ReportContext';

export default function ProductVariantSelector({ selectedVariants, setSelectedVariants }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [suggestions, setSuggestions] = useState([]);
  const { searchProductVariants } = useReport();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm) {
        const results = await searchProductVariants(debouncedSearchTerm);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm, searchProductVariants]);

  const handleSelect = (variant) => {
    if (!selectedVariants.find((v) => v.variantId === variant.variantId) && selectedVariants.length < 5) {
      setSelectedVariants([...selectedVariants, variant]);
    }
    setSearchTerm('');
    setSuggestions([]);
    
  };

  useEffect(()=>{
    console.log(selectedVariants)
  },[selectedVariants])
  const handleRemove = (variantId) => {
    setSelectedVariants(selectedVariants.filter((v) => v.variantId !== variantId));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar variantes vendidas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((variant) => (
            <li key={variant.variantId} onClick={() => handleSelect(variant)}>
              {variant.name}
            </li>
          ))}
        </ul>
      )}
      <div>
        {selectedVariants.map((variant) => (
          <span key={variant.variantId}>
            {variant.name}
            <button onClick={() => handleRemove(variant.variantId)}>Eliminar</button>
          </span>
        ))}
      </div>
    </div>
  );
}
