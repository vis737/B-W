// apps/web/src/contexts/WishlistContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@bw/shared';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { showToast } = useToast();

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        showToast(`${product.name} is already in your wishlist`, 'info');
        return prev;
      }
      showToast(`Added ${product.name} to wishlist`, 'success', 'Wishlist Updated');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const removed = prev.find((p) => p.id === productId);
      if (removed) {
        showToast(`Removed ${removed.name} from wishlist`, 'info');
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
