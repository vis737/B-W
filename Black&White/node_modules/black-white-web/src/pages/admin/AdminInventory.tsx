// apps/web/src/pages/admin/AdminInventory.tsx
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const { showToast } = useToast();

  const handleStockChange = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock_quantity: newStock } : v))
        };
      })
    );
    showToast('Stock quantity updated in inventory database.', 'success', 'Inventory Updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Stock Control</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Inventory & Stock Alerts</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Item & Variant</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Size / Color</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4">Alert Status</th>
              <th className="p-4 text-right">Adjust Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {products.flatMap((prod) =>
              prod.variants.map((v) => {
                const isOut = v.stock_quantity <= 0;
                const isLow = v.stock_quantity > 0 && v.stock_quantity <= 5;
                return (
                  <tr key={`${prod.id}-${v.id}`} className="hover:bg-zinc-900/50">
                    <td className="p-4 font-bold text-white">{prod.name}</td>
                    <td className="p-4 text-zinc-500">{v.sku || prod.sku}</td>
                    <td className="p-4">{v.color} / {v.size}</td>
                    <td className="p-4 font-bold text-amber-400">{v.stock_quantity} pcs</td>
                    <td className="p-4">
                      {isOut && <span className="px-2.5 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[10px] uppercase font-bold rounded">Out of Stock</span>}
                      {isLow && <span className="px-2.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[10px] uppercase font-bold rounded">Low Stock</span>}
                      {!isOut && !isLow && <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold rounded">Optimal</span>}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleStockChange(prod.id, v.id, Math.max(0, v.stock_quantity - 1))}
                        className="px-2.5 py-1 bg-zinc-800 text-white rounded font-bold hover:bg-zinc-700"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleStockChange(prod.id, v.id, v.stock_quantity + 5)}
                        className="px-2.5 py-1 bg-amber-400 text-black rounded font-bold hover:bg-white"
                      >
                        +5
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
