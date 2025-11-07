import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const SearchBar: React.FC = () => {
  const { dispatch } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  return (
    <div className="relative">
      <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-64' : 'w-10'}`}>
        <input
          type="text"
          placeholder="Search products..."
          className={`
            bg-background/80 border-b border-primary/10 py-2 pl-10 pr-4
            focus:outline-none focus:border-gold/30
            placeholder-secondary/50 text-primary text-sm
            transition-all duration-300
            ${isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}
          `}
          onChange={handleSearch}
          onFocus={() => setIsExpanded(true)}
          onBlur={(e) => {
            if (!e.target.value) {
              setIsExpanded(false);
            }
          }}
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors duration-300
            ${isExpanded ? 'opacity-50' : 'opacity-100'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;