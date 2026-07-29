import React from 'react';
import { Drawer } from '../ui/Drawer';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, removeItem, updateQuantity, isDrawerOpen, setIsDrawerOpen } = useCart();

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="Shopping Cart"
      size="sm"
    >
      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-bw-gray-500">
          <p>Your cart is empty.</p>
          <Button className="mt-4" onClick={() => setIsDrawerOpen(false)}>Start Shopping</Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img src={item.image_url} alt={item.product_name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-semibold text-bw-black">{item.product_name}</h4>
                  <p className="text-sm text-bw-gray-600">{item.color} / {item.size}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-sm text-red-500 underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t mt-auto">
            <div className="flex justify-between font-bold mb-4">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" onClick={() => setIsDrawerOpen(false)}>
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
};
