import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { CartItem, Cart } from '@black-white/shared';


interface CartContextType {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity, total_price: (item.quantity + newItem.quantity) * (item.discount_price || item.unit_price) }
            : item
        );
      }
      return [...prevItems, newItem];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity, total_price: quantity * (item.discount_price || item.unit_price) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cart: Cart = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const shipping_cost = items.length > 0 ? 10 : 0; // Flat $10 shipping for now if not empty
    const tax_amount = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping_cost + tax_amount;

    return {
      items,
      subtotal,
      discount_amount: 0,
      shipping_cost,
      tax_amount,
      total,
      currency: 'USD',
      gift_wrapping: false,
      reward_points_used: 0,
      reward_points_discount: 0,
    };
  }, [items]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
