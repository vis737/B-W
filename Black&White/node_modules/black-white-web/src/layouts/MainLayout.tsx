// apps/web/src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
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
      <SEO />
      <Header />
      <SecretAdminListener />
      <SecretAdminModal />
      <CustomerAuthModal />
      <main className="flex-grow pt-[80px]"> {/* Height of the sticky header */}
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;
