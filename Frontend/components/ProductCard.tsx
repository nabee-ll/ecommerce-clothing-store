import React, { useContext } from 'react';
import { Product } from '../types';
import { AppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch, state } = useContext(AppContext);
  const { user } = state;

  const viewDetails = () => {
    dispatch({ type: 'SET_VIEW', payload: { view: 'product', productId: product.id } });
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // Save the product to localStorage and redirect to login
      localStorage.setItem('pendingCartProduct', JSON.stringify(product));
      dispatch({ type: 'SET_VIEW', payload: { view: 'login' } });
      return;
    }
    dispatch({type: 'ADD_TO_CART', payload: product});
  }

  return (
    <div 
      onClick={viewDetails}
      className="bg-surface overflow-hidden cursor-pointer group"
    >
      <div className="relative h-[450px]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-500 flex items-center justify-center p-4">
          <button
            onClick={handleAddToCart}
            className="bg-white/90 hover:bg-white text-primary py-3 px-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-sm tracking-wider"
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <div className="p-6 space-y-2">
        <h3 className="font-serif text-lg text-primary">{product.name}</h3>
        <p className="text-secondary text-sm font-light">{product.description}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg text-primary font-light">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-xs tracking-wider text-secondary">
            {product.stock > 0 ? 'IN STOCK' : 'COMING SOON'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;