
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

export interface User {
  id: number;
  username: string;
}

export type View = 'home' | 'product' | 'login' | 'register' | 'cart' | 'orders';

export type Action =
  | { type: 'SET_VIEW'; payload: { view: View; productId?: number | null } }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_USER'; payload: { user: User | null; token: string | null } }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' };
