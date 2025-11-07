import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import SearchFilters from '../components/SearchFilters';

const HomePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { products, filteredProducts, searchQuery } = state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await api.getProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: productsData });
        setError(null);
      } catch (err) {
        setError('Could not fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPageTitle = () => {
    if (searchQuery) return 'Search Results';
    if (state.filterOptions.categories.length > 0) {
      if (state.filterOptions.categories.some(cat => cat.includes("Women"))) return "Women's Collection";
      if (state.filterOptions.categories.some(cat => cat.includes("Men"))) return "Men's Collection";
      if (state.filterOptions.categories.includes("Accessories")) return "Accessories";
    }
    if (state.filterOptions.sortBy === 'newest') return 'New Arrivals';
    return 'Our Collection';
  };

  const handleCategoryClick = async (categories: string[]) => {
    try {
      setLoading(true);
      const category = categories[0].toLowerCase();
      
      // Update view and filter options first to show loading state
      dispatch({ type: 'SET_VIEW', payload: 'category' });
      dispatch({
        type: 'SET_FILTER_OPTIONS',
        payload: {
          categories: [category],
          priceRange: { min: 0, max: 1000 },
          sortBy: null
        }
      });
      
      // Fetch products for the selected category
      const productsData = await api.getProducts(category);
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
      dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: productsData });
      
    } catch (err) {
      setError('Could not fetch category products. Please try again later.');
      // Reset view on error
      dispatch({ type: 'SET_VIEW', payload: 'home' });
    } finally {
      setLoading(false);
    }
  };

  const showProductGrid = searchQuery || 
    state.filterOptions.categories.length > 0 || 
    state.filterOptions.sortBy || 
    state.view === 'category';

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      {showProductGrid ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-primary tracking-tight">{getPageTitle()}</h1>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_FILTERS' })}
              className="text-secondary hover:text-primary text-sm tracking-wide transition-colors duration-300 flex items-center space-x-2"
            >
              <span>{state.showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
            </button>
          </div>

          <div className="flex gap-8">
            {state.showFilters && (
              <div className="w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <SearchFilters />
                </div>
              </div>
            )}
            
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(filteredProducts.length > 0 ? filteredProducts : products).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {filteredProducts.length === 0 && searchQuery && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-secondary text-lg">No products found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          {/* Category grid */}
          <div className="space-y-8 py-8 max-w-6xl mx-auto mb-16">
            {/* Women's Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => handleCategoryClick(["women"])}
                className="group cursor-pointer relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" 
                  alt="Women's Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <div>
                    <h2 className="text-white font-serif text-2xl tracking-wide mb-2">Women's Collection</h2>
                    <p className="text-white/80 text-sm">Discover our latest women's fashion</p>
                  </div>
                </div>
              </div>
              
              {/* Accessories Category */}
              <div 
                onClick={() => handleCategoryClick(["accessories"])}
                className="group cursor-pointer relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80" 
                  alt="Accessories"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <div>
                    <h2 className="text-white font-serif text-2xl tracking-wide mb-2">Accessories</h2>
                    <p className="text-white/80 text-sm">Complete your look</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Men's & Featured Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => handleCategoryClick(["men"])}
                className="group cursor-pointer relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80" 
                  alt="Men's Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <div>
                    <h2 className="text-white font-serif text-2xl tracking-wide mb-2">Men's Collection</h2>
                    <p className="text-white/80 text-sm">Elevate your style</p>
                  </div>
                </div>
              </div>
              
              {/* New Arrivals */}
              <div 
                onClick={() => dispatch({ type: 'SET_FILTER_OPTIONS', payload: { sortBy: 'newest' } })}
                className="group cursor-pointer relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80" 
                  alt="New Arrivals"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <div>
                    <h2 className="text-white font-serif text-2xl tracking-wide mb-2">New Arrivals</h2>
                    <p className="text-white/80 text-sm">Explore the latest trends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-screen seasonal collection banner */}
          <div className="relative w-full h-screen bg-[#2C1810] overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&q=80"
                alt="Fall Winter 2025 Collection"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-end px-16">
              <div className="text-right">
                <h3 className="text-white text-xl mb-2 tracking-widest">MEN</h3>
                <h2 className="text-white text-5xl md:text-7xl font-serif mb-8">Fall Winter 2025</h2>
                <button
                  onClick={() => handleCategoryClick(["men"])}
                  className="border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-[#2C1810] transition-colors duration-300 tracking-wider"
                >
                  EXPLORE MEN'S COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;