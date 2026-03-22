/**
 * CategoryFilter - Lista horizontal de categorías filtrables
 */

import { useVault } from '../../../contexts/VaultContext';
import './CategoryFilter.css';

export const CategoryFilter = () => {
  const { categories, selectedCategory, setSelectedCategory } = useVault();

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Colores predefinidos para categorías
  const getCategoryColor = (index) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
      '#f97316', '#eab308', '#22c55e', '#06b6d4',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="category-filter">
      <button
        className={`category-filter__item ${!selectedCategory ? 'active' : ''}`}
        onClick={() => setSelectedCategory(null)}
      >
        <span className="category-filter__dot" style={{ background: '#64748b' }} />
        <span className="category-filter__name">Todas</span>
      </button>

      {categories.map((category, index) => (
        <button
          key={category.id}
          className={`category-filter__item ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => handleSelect(category.id)}
          title={category.description}
        >
          <span 
            className="category-filter__dot" 
            style={{ background: getCategoryColor(index) }}
          />
          <span className="category-filter__name">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;