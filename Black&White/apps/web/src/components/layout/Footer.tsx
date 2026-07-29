import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Thank you for subscribing to the B&W Private Society.', 'success', 'Subscription Confirmed');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-zinc-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">

          <div className="lg:col-span-4">
            <h4 className="font-serif text-3xl font-black tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="text-amber-400">❖</span> B&W.
            </h4>
            <p className="text-zinc-400 font-sans font-light leading-relaxed max-w-sm text-sm mb-6">
              Haute couture and luxury menswear tailored from Sea Island cotton, Italian silk, and rare cashmere. Uncompromising quality for discerning gentlemen.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">
              <span>EST. 2026</span>
              <span>•</span>
              <span>PARIS / MILAN / NYC</span>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h5 className="uppercase font-sans font-semibold tracking-[0.2em] text-amber-400/80 mb-6 text-xs">Categories</h5>
            <ul className="space-y-3 font-sans font-light text-zinc-300 text-sm">
              <li><Link to="/shop?category=suits" className="hover:text-amber-400 transition-colors">Suits & Tuxedos</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-amber-400 transition-colors">Fine Shirts</Link></li>
              <li><Link to="/shop?category=coats" className="hover:text-amber-400 transition-colors">Outerwear</Link></li>
              <li><Link to="/shop?category=shoes" className="hover:text-amber-400 transition-colors">Footwear</Link></li>
              <li><Link to="/shop?category=perfumes" className="hover:text-amber-400 transition-colors">Haute Parfumerie</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="uppercase font-sans font-semibold tracking-[0.2em] text-amber-400/80 mb-6 text-xs">Client Care</h5>
            <ul className="space-y-3 font-sans font-light text-zinc-300 text-sm">
              <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">My Account</Link></li>
              <li><Link to="/membership" className="hover:text-amber-400 transition-colors">Membership Perks</Link></li>
              <li><Link to="/brand-story" className="hover:text-amber-400 transition-colors">Our Heritage</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ & Support</Link></li>
              <li><Link to="/blog" className="hover:text-amber-400 transition-colors">The Journal</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h5 className="uppercase font-sans font-semibold tracking-[0.2em] text-amber-400/80 mb-6 text-xs">Private Gazette</h5>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-light text-zinc-400 leading-relaxed">
                Subscribe to receive private invitations to flash sales, bespoke trunk shows, and new drops.
              </p>
              <form onSubmit={handleSubscribe} className="group relative border-b border-zinc-700 pb-2 flex items-center justify-between">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent w-full text-white placeholder-zinc-600 outline-none text-xs font-light"
                  required
                />
                <button type="submit" className="text-xs uppercase tracking-widest font-bold text-amber-400 hover:text-white transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800 text-xs font-light text-zinc-500 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} BLACK & WHITE HAUTE COUTURE. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

