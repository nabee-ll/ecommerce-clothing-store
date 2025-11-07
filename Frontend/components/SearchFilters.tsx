import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FilterOptions } from '../types';

const SearchFilters: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { filterOptions, products } = state;

  const maxPrice = Math.max(...products.map(p => p.price));
  const categories = Array.from(new Set(products.map(p => p.category || 'Other')));

  const updateFilters = (updates: Partial<FilterOptions>) => {
    dispatch({ type: 'SET_FILTER_OPTIONS', payload: updates });
  };

  return (
    <div className="space-y-6 p-6 bg-surface border border-border rounded-lg">
      <div>
        <h3 className="text-primary font-serif text-lg mb-4">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-secondary">Min Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">₹</span>
              <input
                type="number"
                value={filterOptions.priceRange.min}
                onChange={(e) => updateFilters({ 
                  priceRange: { ...filterOptions.priceRange, min: Number(e.target.value) }
                })}
                className="w-full bg-background border border-border rounded pl-7 pr-3 py-2 text-sm"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-secondary">Max Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">₹</span>
              <input
                type="number"
                value={filterOptions.priceRange.max}
                onChange={(e) => updateFilters({ 
                  priceRange: { ...filterOptions.priceRange, max: Number(e.target.value) }
                })}
                className="w-full bg-background border border-border rounded pl-7 pr-3 py-2 text-sm"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-primary font-serif text-lg mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterOptions.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filterOptions.categories, category]
                    : filterOptions.categories.filter(c => c !== category);
                  updateFilters({ categories: newCategories });
                }}
                className="text-gold focus:ring-gold rounded"
              />
              <span className="text-secondary text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-primary font-serif text-lg mb-4">Sort By</h3>
        <select
          value={filterOptions.sortBy || ''}
          onChange={(e) => updateFilters({ 
            sortBy: e.target.value as FilterOptions['sortBy']
          })}
          className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-secondary"
        >
          <option value="">Most Relevant</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <button
        onClick={() => {
          updateFilters({
            priceRange: { min: 0, max: maxPrice },
            categories: [],
            sortBy: null
          });
          dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
        }}
        className="w-full bg-background hover:bg-gold/5 text-primary border border-border rounded px-4 py-2 text-sm transition-colors duration-300"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SearchFilters;