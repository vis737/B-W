// apps/web/src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SecretAdminListener } from '../components/auth/SecretAdminListener';
import { SecretAdminModal } from '../components/auth/SecretAdminModal';
import { CustomerAuthModal } from '../components/auth/CustomerAuthModal';

export const AdminLayout: React.FC = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Analytics & Overview', href: '/admin', icon: '📊' },
        { name: 'Orders Management', href: '/admin/orders', icon: '📦' },
        { name: 'Products CRUD', href: '/admin/products', icon: '👔' },
        { name: 'Categories & Ages', href: '/admin/categories', icon: '🏷️' },
        { name: 'Inventory & Stock', href: '/admin/inventory', icon: '🏬' },
        { name: 'Customers & Tiers', href: '/admin/customers', icon: '👥' },
        { name: 'Coupons & Vouchers', href: '/admin/coupons', icon: '🎁' },
        { name: 'Bank Payment Receipts', href: '/admin/payments', icon: '🏦' },
        { name: 'Reviews Moderation', href: '/admin/reviews', icon: '⭐' },
        { name: 'Support Tickets', href: '/admin/tickets', icon: '💬' },
        { name: 'Newsletter & Marketing', href: '/admin/marketing', icon: '📢' },
        { name: 'CMS & Banners', href: '/admin/cms', icon: '🖼️' },
        { name: 'SEO Manager', href: '/admin/seo', icon: '🔍' },
        { name: 'Blog / Editorial', href: '/admin/blog', icon: '✍️' },
        { name: 'Reports & Audits', href: '/admin/reports', icon: '📈' },
        { name: 'Staff & Roles', href: '/admin/staff', icon: '🛡️' },
        { name: 'System Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    const isActive = (path: string) => {
        if (path === '/admin' && location.pathname !== '/admin') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            <SecretAdminListener />
            <SecretAdminModal />
            <CustomerAuthModal />

            {/* Sidebar Desktop */}
            <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-800 bg-zinc-950">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between h-20 flex-shrink-0 px-6 border-b border-zinc-800">
                        <Link to="/admin" className="font-serif font-black text-lg tracking-widest uppercase text-white flex items-center gap-2">
                            <span className="text-amber-400">❖</span>
                            <span>B&W ENTERPRISE</span>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-4 space-y-1 no-scrollbar">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`${
                                        active
                                            ? 'bg-amber-400 text-black font-bold shadow-lg'
                                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                    } group flex items-center gap-3 px-3 py-2.5 text-xs font-sans rounded-lg transition-all`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex-shrink-0 p-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
                        <Link to="/" className="text-amber-400 hover:underline flex items-center gap-1">
                            &larr; Storefront
                        </Link>
                        <span>v2.4 Pro</span>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Top */}
            <div className="md:hidden bg-zinc-950 border-b border-zinc-800 flex items-center justify-between p-4 flex-shrink-0">
                 <Link to="/admin" className="font-serif font-black text-base tracking-wider text-amber-400">
                     B&W ENTERPRISE
                 </Link>
                 <button
                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                   className="text-xs uppercase font-mono px-3 py-1.5 border border-zinc-800 rounded text-zinc-300"
                 >
                   Menu
                 </button>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-zinc-950 p-4 border-b border-zinc-800 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 px-3 text-xs rounded ${isActive(item.href) ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'}`}
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Main Content Area */}
            <div className="md:pl-72 flex flex-col flex-1">
                <main className="flex-1 p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
