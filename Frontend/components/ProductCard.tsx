import React, { useContext } from 'react';
import { Product } from '../types';
import { AppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useContext(AppContext);

  const viewDetails = () => {
    dispatch({ type: 'SET_VIEW', payload: { view: 'product', productId: product.id } });
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({type: 'ADD_TO_CART', payload: product});
  }

  return (
    <div 
      onClick={viewDetails}
      className="bg-surface rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 cursor-pointer group"
    >
      <div className="relative h-72">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center p-4">
             <button
                onClick={handleAddToCart}
                className="bg-accent text-white py-2.5 px-6 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
                Add to Cart
            </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-primary truncate">{product.name}</h3>
        <p className="text-secondary mt-1 text-sm truncate">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;