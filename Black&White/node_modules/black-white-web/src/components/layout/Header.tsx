// apps/web/src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import { ScrollProgress } from '../ui/ScrollProgress';
import { AISearchModal } from '../shop/AISearchModal';

const mainNavLinks = [
  { name: 'Shop Gentlemen', href: '/shop' },
  { name: 'Suits & Tuxedos', href: '/shop?category=suits' },
  { name: 'Shirts', href: '/shop?category=shirts' },
  { name: 'Outerwear', href: '/shop?category=coats' },
  { name: 'Gentleman Subscription', href: '/membership' },
  { name: 'Journal', href: '/blog' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const { cart, setIsDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const { isCustomerLoggedIn, setIsCustomerModalOpen } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAccountClick = () => {
    if (isCustomerLoggedIn) {
      navigate('/dashboard');
    } else {
      setIsCustomerModalOpen(true);
    }
  };

  return (
    <>
      <ScrollProgress />
      <AISearchModal isOpen={isAISearchOpen} onClose={() => setIsAISearchOpen(false)} />
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b-2 border-black py-3.5 shadow-xl text-black'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5 text-white'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            className={`md:hidden p-2 -ml-2 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7"/>
            </svg>
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-serif font-black tracking-widest uppercase flex items-center gap-2 group"
          >
            <span className="text-amber-500 group-hover:rotate-12 transition-transform duration-300">❖</span>
            <span className={isScrolled ? 'text-black' : 'text-white'}>B&W.</span>
            <span className="hidden sm:inline-block text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 border border-current rounded uppercase">
              Gentlemen
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors underline-sweep ${
                  isScrolled ? 'text-zinc-800 hover:text-black' : 'text-white/90 hover:text-amber-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Utils */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAISearchOpen(true)}
              title="AI Search & Autocomplete"
              className={`p-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                isScrolled ? 'text-black hover:bg-zinc-100' : 'text-white hover:text-amber-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span className={`hidden xl:inline text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                isScrolled ? 'bg-black text-white border-black' : 'bg-amber-400/20 text-amber-300 border-amber-500/30'
              }`}>
                AI Search
              </span>
            </button>

            <Link
              to="/wishlist"
              title="Wishlist"
              className={`relative p-1.5 rounded-full transition-colors ${
                isScrolled ? 'text-black hover:bg-zinc-100' : 'text-white hover:text-amber-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] text-black font-bold flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              title="Shopping Bag"
              className={`relative p-1.5 rounded-full transition-colors ${
                isScrolled ? 'text-black hover:bg-zinc-100' : 'text-white hover:text-amber-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white border border-white text-[10px] font-bold flex items-center justify-center shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={handleAccountClick}
              title="Gentleman Account"
              className={`p-1.5 rounded-full transition-colors ${
                isScrolled ? 'text-black hover:bg-zinc-100' : 'text-white hover:text-amber-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white text-black p-8 pt-24 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center pb-6 border-b-2 border-black">
                <span className="text-xl font-serif font-black uppercase tracking-widest text-black">
                  Gentleman Navigation
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-black text-xl font-bold">✕</button>
              </div>

              {mainNavLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.name}
                >
                  <Link
                    to={link.href}
                    className="text-2xl font-serif font-bold uppercase tracking-wider text-black hover:text-amber-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-6 border-t-2 border-black flex flex-col gap-4">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleAccountClick(); }}
                  className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2 text-left"
                >
                  <span>Gentleman Account Portal &rarr;</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
