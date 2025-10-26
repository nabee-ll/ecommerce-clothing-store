import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Product } from '../types';
import Spinner from '../components/Spinner';
import api from '../services/api';

const ProductDetailPage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { currentProductId, products } = state;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!currentProductId) {
        setError('No product selected.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const existingProduct = products.find(p => p.id === currentProductId);
        if(existingProduct) {
            setProduct({ ...existingProduct, image: existingProduct.image.replace('400/400', '600/600') });
        } else {
            const productData = await api.getProductById(currentProductId);
            setProduct(productData);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [currentProductId, products]);
  
  const handleAddToCart = () => {
    if (product) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center">Product not found.</p>;

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="w-full h-auto overflow-hidden rounded-lg">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <button onClick={() => dispatch({type: 'SET_VIEW', payload: {view: 'home'}})} className="text-accent hover:underline mb-4 self-start">&larr; Back to collection</button>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary tracking-tight">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary my-4">${product.price.toFixed(2)}</p>
          <p className="text-secondary leading-relaxed text-base">{product.description}</p>
          <div className="mt-6">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Low Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-accent text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600/90 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;