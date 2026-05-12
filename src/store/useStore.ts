import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: {
    color?: string;
    material?: string;
    size?: string;
  };
}

export function cartCustomizationKey(c?: CartItem['customization']): string {
  return JSON.stringify(c ?? {});
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin';
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, customization?: CartItem['customization']) => void;
  updateQuantity: (productId: string, quantity: number, customization?: CartItem['customization']) => void;
  isLineInCart: (productId: string, customization?: CartItem['customization']) => boolean;
  clearCart: () => void;
  cartTotal: () => number;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Auth State
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  
  // Product customization
  selectedProduct: any | null;
  setSelectedProduct: (product: any) => void;
  customization: {
    color?: string;
    material?: string;
    size?: string;
  };
  setCustomization: (customization: any) => void;
  resetCustomization: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      addToCart: (item) => {
        const existingItem = get().cart.find(
          (cartItem) => 
            cartItem.productId === item.productId &&
            JSON.stringify(cartItem.customization) === JSON.stringify(item.customization)
        );
        
        if (existingItem) {
          set({
            cart: get().cart.map((cartItem) =>
              cartItem.productId === item.productId &&
              JSON.stringify(cartItem.customization) === JSON.stringify(item.customization)
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (productId, customization) => {
        const key = cartCustomizationKey(customization);
        set({
          cart: get().cart.filter(
            (item) =>
              !(item.productId === productId && cartCustomizationKey(item.customization) === key),
          ),
        });
      },
      updateQuantity: (productId, quantity, customization) => {
        const key = cartCustomizationKey(customization);
        if (quantity <= 0) {
          get().removeFromCart(productId, customization);
        } else {
          set({
            cart: get().cart.map((item) =>
              item.productId === productId && cartCustomizationKey(item.customization) === key
                ? { ...item, quantity }
                : item,
            ),
          });
        }
      },
      isLineInCart: (productId, customization) => {
        const key = cartCustomizationKey(customization);
        return get().cart.some(
          (item) =>
            item.productId === productId && cartCustomizationKey(item.customization) === key,
        );
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      // Favorites state
      favorites: [],
      toggleFavorite: (productId) => {
        const favorites = get().favorites;
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter(id => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
      
      // UI state
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      
      // Auth state
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null, cart: [] }),
      
      // Customization state
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      customization: {},
      setCustomization: (customization) => 
        set({ customization: { ...get().customization, ...customization } }),
      resetCustomization: () => set({ customization: {} }),
    }),
    {
      name: 'vivere-in-style-storage',
      partialize: (state) => ({ 
        cart: state.cart, 
        favorites: state.favorites,
        user: state.user, 
        accessToken: state.accessToken 
      }),
    }
  )
);