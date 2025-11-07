
export interface AppState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  filterOptions: FilterOptions;
  view: View;
  showFilters: boolean;
}

export interface FilterOptions {
  priceRange: { min: number; max: number };
  categories: string[];
  sortBy: 'price_low' | 'price_high' | 'newest' | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  createdAt?: string;
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

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export type View = 'home' | 'product' | 'login' | 'register' | 'cart' | 'orders' | 'category' | 'forgot-password' | 'reset-password';

export type Action =
  | { type: 'SET_VIEW'; payload: { view: View; productId?: number | null } }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_USER'; payload: { user: User | null; token: string | null } }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_OPTIONS'; payload: Partial<FilterOptions> }
  | { type: 'TOGGLE_FILTERS'; payload?: boolean };
