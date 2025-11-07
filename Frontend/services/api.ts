
import { Product, Order, RegisterUserData } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  error?: string;
  message?: string;
  data?: T;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
};

interface LoginCredentials {
  username: string;
  password: string;
}

interface StockMovement {
  productId: number;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason?: string;
}

const api = {
  getProducts: async (category?: string): Promise<Product[]> => {
    const url = category 
      ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/products`;
    const response = await fetch(url);
    return handleResponse<Product[]>(response);
  },

  getStockLevels: async () => {
    const response = await fetch(`${API_BASE_URL}/api/products/stock`);
    return handleResponse<{ productId: number; quantity: number }[]>(response);
  },

  updateStock: async (productId: number, quantity: number, type: 'in' | 'out' | 'adjustment', reason?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/stock/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity_change: quantity,
        movement_type: type,
        reason: reason || ''
      })
    });
    return handleResponse<{ success: boolean; message: string }>(response);
  },

  getStockMovements: async () => {
    const response = await fetch(`${API_BASE_URL}/api/products/stock/movements`);
    return handleResponse<StockMovement[]>(response);
  },

  getLowStockProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/products/stock/low`);
    return handleResponse<Product[]>(response);
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse<Product>(response);
  },

  registerUser: async (userData: RegisterUserData): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Attempting to register user:', { username: userData.username, email: userData.email });
      
      const response = await fetch(`${API_BASE_URL}/add_user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password
        }),
        credentials: 'include'
      });

      return handleResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  loginUser: async (credentials: LoginCredentials): Promise<{ user: { id: number; username: string; email: string }; access_token: string }> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse<{ user: { id: number; username: string; email: string }; access_token: string }>(response);
  },

  placeOrder: async (orderData: { user_id: number; items: { product_id: number; quantity: number; price: number }[] }, token: string): Promise<{ order_id: number; message: string; total_price: number }> => {
    const response = await fetch(`${API_BASE_URL}/place_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse<{ order_id: number; message: string; total_price: number }>(response);
  },

  getOrderHistory: async (token: string): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse<Order[]>(response);
  },

  cancelOrder: async (orderId: number, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ message: string }>(response);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      console.log('Sending forgot password request for email:', email);
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      console.log('Forgot password response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Forgot password error:', errorData);
        throw new Error(errorData.error || 'Failed to send reset email');
      }
      
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Forgot password request failed:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please make sure the server is running.');
      }
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, new_password: newPassword }),
    });
    return handleResponse<{ message: string }>(response);
  },
};

export default api;
