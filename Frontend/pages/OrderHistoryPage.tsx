import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Order } from '../types';
import api from '../services/api';
import Spinner from '../components/Spinner';

const OrderHistoryPage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { token, products } = state;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      dispatch({ type: 'SET_VIEW', payload: { view: 'login' } });
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderData = await api.getOrderHistory(token);
        setOrders(orderData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        setError(null);
      } catch (err) {
        setError('Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [token, dispatch]);
  
  const getProductDetails = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.cancelOrder(orderId, token!);
      // Refresh orders after cancellation
      const orderData = await api.getOrderHistory(token!);
      setOrders(orderData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      alert('Order cancelled successfully!');
    } catch (err) {
      alert('Failed to cancel order. Please try again.');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 tracking-tight">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-secondary py-16">You have no past orders.</p>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-background p-4 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">Order #{order.id}</h2>
                  <p className="text-sm text-secondary">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-sm mt-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="text-right flex flex-col items-end space-y-2">
                  <p className="font-bold text-lg">Total: ₹{order.total_price.toFixed(2)}</p>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors duration-300"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              <ul className="space-y-4 p-4">
                {order.items.map((item, index) => {
                  const product = getProductDetails(item.product_id);
                  return (
                    <li key={index} className="flex items-center space-x-4">
                      <img src={product?.image} alt={product?.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-grow">
                        <p className="font-medium">{product?.name || 'Product not found'}</p>
                        <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-secondary">${item.price.toFixed(2)} each</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;