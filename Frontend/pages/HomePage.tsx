import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { products } = state;
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

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">Our Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;