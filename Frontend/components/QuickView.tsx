import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface QuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Image Gallery */}
                        <div className="relative">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                            {product.sale_price && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded">
                                    Sale
                                </span>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                            </h2>
                            <div className="mt-2">
                                <p className="text-gray-500 dark:text-gray-300">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mt-4">
                                {product.sale_price ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-bold text-red-500">
                                            ${product.sale_price}
                                        </span>
                                        <span className="text-lg text-gray-500 line-through">
                                            ${product.price}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${product.price}
                                    </span>
                                )}
                            </div>

                            {/* Size Selector */}
                            {product.sizes && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Size
                                    </label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-md ${
                                                    selectedSize === size
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selector */}
                            {product.colors && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Color
                                    </label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 ${
                                                    selectedColor === color
                                                        ? 'border-blue-500'
                                                        : 'border-transparent'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            >
                                                <span className="sr-only">{color}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Quantity
                                </label>
                                <div className="mt-2 flex items-center space-x-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1 border rounded-md"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-1 border rounded-md"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-2">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Add to Cart
                                </button>
                                <button className="w-full border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Add to Wishlist
                                </button>
                            </div>

                            {/* Stock Status */}
                            <div className="mt-4">
                                <p className={`text-sm ${
                                    product.stock_quantity > 10
                                        ? 'text-green-500'
                                        : product.stock_quantity > 0
                                        ? 'text-yellow-500'
                                        : 'text-red-500'
                                }`}>
                                    {product.stock_quantity > 10
                                        ? 'In Stock'
                                        : product.stock_quantity > 0
                                        ? `Only ${product.stock_quantity} left`
                                        : 'Out of Stock'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default QuickView;