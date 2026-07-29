// apps/web/src/pages/AdminProducts.tsx
import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import { Product } from '@black-white/shared';
import { useToast } from '../contexts/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    basePrice: '',
    categorySlug: MOCK_CATEGORIES[0].slug,
    brand: 'Black & White Private Reserve',
    shortDescription: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop',
    isLimited: false,
    isFeatured: true,
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      sku: newProduct.sku || `BW-NEW-${Math.floor(Math.random() * 900 + 100)}`,
      short_description: newProduct.shortDescription,
      description: newProduct.description,
      base_price: parseFloat(newProduct.basePrice) || 350,
      currency: 'USD',
      gender: 'men',
      categories: [MOCK_CATEGORIES.find(c => c.slug === newProduct.categorySlug) || MOCK_CATEGORIES[0]],
      age_groups: [],
      images: [{ id: 'img-new', product_id: 'p-new', url: newProduct.imageUrl, is_primary: true, sort_order: 1 }],
      variants: [{ id: 'v-new', product_id: 'p-new', color: 'Black', size: 'M', stock_quantity: 10, price_adjustment: 0, is_active: true }],
      brand: newProduct.brand,
      is_active: true,
      is_featured: newProduct.isFeatured,
      is_new_arrival: true,
      is_trending: false,
      is_limited_edition: newProduct.isLimited,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProducts([created, ...products]);
    showToast(`Created new product "${created.name}".`, 'success', 'Product Added');
    setShowAddModal(false);
    setNewProduct({
      name: '',
      sku: '',
      basePrice: '',
      categorySlug: MOCK_CATEGORIES[0].slug,
      brand: 'Black & White Private Reserve',
      shortDescription: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop',
      isLimited: false,
      isFeatured: true,
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    showToast('Product deleted from database.', 'info', 'Product Removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Catalog System</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Products Management</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors"
        >
          + Add New Garment
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Item</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Badges</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <img src={prod.images[0]?.url} alt={prod.name} className="w-10 h-12 object-cover rounded bg-zinc-900" />
                  <span>{prod.name}</span>
                </td>
                <td className="p-4 text-zinc-400">{prod.sku}</td>
                <td className="p-4 text-amber-400 font-bold">${prod.base_price.toFixed(2)}</td>
                <td className="p-4">{prod.categories[0]?.name || 'Apparel'}</td>
                <td className="p-4 space-x-1">
                  {prod.is_limited_edition && <span className="px-2 py-0.5 bg-amber-400/20 text-amber-400 text-[9px] uppercase font-bold rounded">Limited</span>}
                  {prod.is_featured && <span className="px-2 py-0.5 bg-sky-400/20 text-sky-400 text-[9px] uppercase font-bold rounded">Featured</span>}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded text-[10px] uppercase font-bold hover:bg-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-xl w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="font-serif font-bold text-lg uppercase text-white">Create Haute Couture Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Royal Silk Sherwani"
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-amber-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="BW-SHIRT-099"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                    placeholder="450"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Category</label>
                <select
                  value={newProduct.categorySlug}
                  onChange={(e) => setNewProduct({ ...newProduct, categorySlug: e.target.value as any })}
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white transition-colors"
              >
                Save Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
