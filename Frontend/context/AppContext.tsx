
import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Action, CartItem, Product, User, View } from '../types';

interface AppState {
  view: View;
  products: Product[];
  currentProductId: number | null;
  user: User | null;
  token: string | null;
  cart: CartItem[];
}

const initialState: AppState = {
  view: 'home',
  products: [],
  currentProductId: null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload.view,
        currentProductId: action.payload.productId || null,
      };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
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
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
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
