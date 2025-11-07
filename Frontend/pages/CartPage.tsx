import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { TrashIcon } from '../components/icons';

const CartPage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { cart, user, token } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalPrice = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      dispatch({ type: 'SET_VIEW', payload: { view: 'login' } });
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const orderData = {
        user_id: user.id,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: Number(item.price)
        }))
    };

    try {
        const response = await api.placeOrder(orderData, token);
        setSuccess(`${response.message} Your order total is $${response.total_price.toFixed(2)}`);
        dispatch({ type: 'CLEAR_CART' });
        setTimeout(() => {
            dispatch({ type: 'SET_VIEW', payload: { view: 'orders' } });
        }, 3000);
    } catch (err: any) {
        setError(err.message || 'Failed to place order.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 tracking-tight">Shopping Cart</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}
      {cart.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-secondary text-lg">Your cart is empty.</p>
            <button onClick={() => dispatch({type: 'SET_VIEW', payload: {view: 'home'}})} className="mt-6 bg-accent text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-blue-600/90 transition-colors">
                Continue Shopping
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <ul className="divide-y divide-border">
              {cart.map(item => (
                <li key={item.id} className="flex items-center py-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-secondary">${Number(item.price).toFixed(2)}</p>
                    <button onClick={() => dispatch({type: 'REMOVE_FROM_CART', payload: item.id})} className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center transition-colors">
                        <TrashIcon /> <span className="ml-1">Remove</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-16 border border-border rounded-md text-center py-1"
                      aria-label={`Quantity for ${item.name}`}
                    />
                  </div>
                  <p className="font-semibold w-24 text-right text-lg">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-background p-6 rounded-lg sticky top-28">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-3 text-secondary">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">FREE</span>
                    </div>
                </div>
                <div className="border-t border-border my-4"></div>
                <div className="flex justify-between font-bold text-xl text-primary">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full mt-6 bg-accent text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600/90 transition disabled:bg-gray-300"
                >
                    {loading ? 'Placing Order...' : (user ? 'Place Order' : 'Login to Checkout')}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;