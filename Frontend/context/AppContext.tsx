
import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Action, CartItem, Product, User, View } from '../types';

export interface FilterOptions {
  priceRange: { min: number; max: number };
  categories: string[];
  sortBy: 'price_low' | 'price_high' | 'newest' | null;
}

export interface AppState {
  view: View;
  products: Product[];
  currentProductId: number | null;
  user: User | null;
  token: string | null;
  cart: CartItem[];
  searchQuery: string;
  filteredProducts: Product[];
  filterOptions: FilterOptions;
  showFilters: boolean;
  currentCategory: string | null;
}

const getInitialState = (): AppState => {
  try {
    // Clear localStorage if it contains invalid data
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) JSON.parse(storedCart);
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) JSON.parse(storedUser);
    } catch (e) {
      console.error('Invalid data in localStorage, clearing...', e);
      localStorage.removeItem('cart');
      localStorage.removeItem('user');
      localStorage.removeItem('currentView');
      localStorage.removeItem('currentProductId');
    }

    return {
      view: 'home',
      products: [],
      currentProductId: null,
      user: null,
      token: null,
      cart: [],
      searchQuery: '',
      filteredProducts: [],
      filterOptions: {
        priceRange: { min: 0, max: 1000 },
        categories: [],
        sortBy: null
      },
      showFilters: false,
      currentCategory: null
    };
  } catch (error) {
    console.error('Error initializing state:', error);
    return {
      view: 'home',
      products: [],
      currentProductId: null,
      user: null,
      token: null,
      cart: [],
      searchQuery: '',
      filteredProducts: [],
      filterOptions: {
        priceRange: { min: 0, max: 1000 },
        categories: [],
        sortBy: null
      },
      showFilters: false,
      currentCategory: null
    };
  }
};

const initialState: AppState = getInitialState();

const applyFilters = (
  products: Product[],
  searchQuery: string,
  filterOptions: FilterOptions
): Product[] => {
  let filtered = products;

  // Apply search query
  if (searchQuery) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery)
    );
  }

  // Apply category filter
  if (filterOptions.categories.length > 0) {
    filtered = filtered.filter(product =>
      filterOptions.categories.includes(product.category || 'Other')
    );
  }

  // Apply price range filter
  filtered = filtered.filter(product =>
    product.price >= filterOptions.priceRange.min &&
    product.price <= filterOptions.priceRange.max
  );

  // Apply sorting
  if (filterOptions.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
  }

  return filtered;
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      localStorage.setItem('currentView', action.payload.view);
      if (action.payload.productId) {
        localStorage.setItem('currentProductId', String(action.payload.productId));
      } else {
        localStorage.removeItem('currentProductId');
      }
      return {
        ...state,
        view: action.payload.view,
        currentProductId: action.payload.productId || null,
      };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, filteredProducts: action.payload };
    case 'SET_SEARCH_QUERY':
      const query = action.payload.toLowerCase();
      return { 
        ...state, 
        searchQuery: query,
        filteredProducts: applyFilters(state.products, query, state.filterOptions),
      };
    
    case 'SET_FILTER_OPTIONS':
      const newOptions = { ...state.filterOptions, ...action.payload };
      return {
        ...state,
        filterOptions: newOptions,
        filteredProducts: applyFilters(state.products, state.searchQuery, newOptions),
      };

    case 'TOGGLE_FILTERS':
      return {
        ...state,
        showFilters: action.payload !== undefined ? action.payload : !state.showFilters,
      };
    case 'SET_USER':
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      const cartItem = {
        id: action.payload.id,
        name: action.payload.name,
        price: Number(action.payload.price),
        image: action.payload.image,
        quantity: 1
      };
      
      const updatedCart = existingItem
        ? state.cart.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...state.cart, cartItem];
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      localStorage.setItem('currentView', 'cart');
      
      return {
        ...state,
        cart: updatedCart,
        view: 'cart'
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item
        ).filter(item => item.quantity > 0),
      };
    case 'REMOVE_FROM_CART':
        return {
            ...state,
            cart: state.cart.filter(item => item.id !== action.payload)
        };
    case 'CLEAR_CART':
        return {...state, cart: []};
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
