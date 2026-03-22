/**
 * SearchBar - Barra de búsqueda con debounce integrado
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useVault } from '../../../contexts/VaultContext';
import './SearchBar.css';

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const { setSearchQuery } = useVault();
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar por sitio, usuario..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button 
          className="search-bar__clear"
          onClick={() => setValue('')}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;