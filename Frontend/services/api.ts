
import { Product, Order } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Replace with your Flask backend URL

const api = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Assuming the backend returns images as part of product data
    return data.map((p: any) => ({ ...p, image: `https://picsum.photos/seed/${p.id}/400/400` }));
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`);
    const data = await response.json();
    return { ...data, image: `https://picsum.photos/seed/${data.id}/600/600` };
  },

  registerUser: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/add_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
    }
    return response.json();
  },

  loginUser: async (credentials: any) => {
    // Assuming a /login endpoint exists
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
    }
    return response.json();
  },

  placeOrder: async (orderData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/place_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
    }
    return response.json();
  },

  getOrderHistory: async (token: string): Promise<Order[]> => {
    // Assuming a /orders endpoint exists for fetching user's orders
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch order history');
    return response.json();
  },
};

export default api;
