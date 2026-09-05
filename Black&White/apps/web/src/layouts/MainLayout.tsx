// apps/web/src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import SEO from '../components/seo/SEO';
import { SecretAdminListener } from '../components/auth/SecretAdminListener';
import { SecretAdminModal } from '../components/auth/SecretAdminModal';
import { CustomerAuthModal } from '../components/auth/CustomerAuthModal';

import { BackToTop } from '../components/ui/BackToTop';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bw-white">
      <ScrollRestoration />
      <SEO />
      <Header />
      <SecretAdminListener />
      <SecretAdminModal />
      <CustomerAuthModal />
      {/* pt offset = sticky header height + iOS safe area */}
      <main className="flex-grow pt-[calc(80px+env(safe-area-inset-top,0px))]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;
