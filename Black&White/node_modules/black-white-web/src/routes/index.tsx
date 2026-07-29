// apps/web/src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '../components/ui/Skeleton';

// Storefront Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const PDP = lazy(() => import('../pages/PDP'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MembershipPage = lazy(() => import('../pages/MembershipPage'));
const BrandStoryPage = lazy(() => import('../pages/BrandStoryPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogPostPage = lazy(() => import('../pages/BlogPostPage'));
const ComingSoonPage = lazy(() => import('../pages/ComingSoonPage'));
const MaintenancePage = lazy(() => import('../pages/MaintenancePage'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

// Enterprise Admin Module Pages
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminOrders = lazy(() => import('../pages/AdminOrders'));
const AdminProducts = lazy(() => import('../pages/AdminProducts'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminInventory = lazy(() => import('../pages/admin/AdminInventory'));
const AdminCustomers = lazy(() => import('../pages/admin/AdminCustomers'));
const AdminCoupons = lazy(() => import('../pages/admin/AdminCoupons'));
const AdminPaymentApprovals = lazy(() => import('../pages/admin/AdminPaymentApprovals'));
const AdminReviews = lazy(() => import('../pages/admin/AdminReviews'));
const AdminTickets = lazy(() => import('../pages/admin/AdminTickets'));
const AdminMarketing = lazy(() => import('../pages/admin/AdminMarketing'));
const AdminCMS = lazy(() => import('../pages/admin/AdminCMS'));
const AdminSEO = lazy(() => import('../pages/admin/AdminSEO'));
const AdminBlog = lazy(() => import('../pages/admin/AdminBlog'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminStaff = lazy(() => import('../pages/admin/AdminStaff'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

// Loading fallback
const PageLoader = () => (
  <div className="p-10 space-y-5 container mx-auto bg-black min-h-screen">
    <Skeleton variant="text" className="h-10 w-1/4 bg-zinc-800" />
    <Skeleton variant="rect" className="h-60 w-full bg-zinc-900" />
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 pt-10">
      <Skeleton variant="rect" className="h-96 w-full bg-zinc-900" />
      <Skeleton variant="rect" className="h-96 w-full bg-zinc-900" />
      <Skeleton variant="rect" className="h-96 w-full bg-zinc-900" />
      <Skeleton variant="rect" className="h-96 w-full bg-zinc-900" />
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Suspense fallback={<PageLoader />}><PageNotFound /></Suspense>,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'shop', element: <Suspense fallback={<PageLoader />}><ShopPage /></Suspense> },
      { path: 'product/:slug', element: <Suspense fallback={<PageLoader />}><PDP /></Suspense> },
      { path: 'search', element: <Suspense fallback={<PageLoader />}><SearchPage /></Suspense> },
      { path: 'wishlist', element: <Suspense fallback={<PageLoader />}><WishlistPage /></Suspense> },
      { path: 'checkout', element: <Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
      { path: 'membership', element: <Suspense fallback={<PageLoader />}><MembershipPage /></Suspense> },
      { path: 'brand-story', element: <Suspense fallback={<PageLoader />}><BrandStoryPage /></Suspense> },
      { path: 'faq', element: <Suspense fallback={<PageLoader />}><FAQPage /></Suspense> },
      { path: 'blog', element: <Suspense fallback={<PageLoader />}><BlogPage /></Suspense> },
      { path: 'blog/:slug', element: <Suspense fallback={<PageLoader />}><BlogPostPage /></Suspense> },
      { path: 'coming-soon', element: <Suspense fallback={<PageLoader />}><ComingSoonPage /></Suspense> },
      { path: 'maintenance', element: <Suspense fallback={<PageLoader />}><MaintenancePage /></Suspense> },
      { path: 'sso-callback', element: <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/" signInForceRedirectUrl="/" /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute requireAdmin={true} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
          { path: 'orders', element: <Suspense fallback={<PageLoader />}><AdminOrders /></Suspense> },
          { path: 'products', element: <Suspense fallback={<PageLoader />}><AdminProducts /></Suspense> },
          { path: 'categories', element: <Suspense fallback={<PageLoader />}><AdminCategories /></Suspense> },
          { path: 'inventory', element: <Suspense fallback={<PageLoader />}><AdminInventory /></Suspense> },
          { path: 'customers', element: <Suspense fallback={<PageLoader />}><AdminCustomers /></Suspense> },
          { path: 'coupons', element: <Suspense fallback={<PageLoader />}><AdminCoupons /></Suspense> },
          { path: 'payments', element: <Suspense fallback={<PageLoader />}><AdminPaymentApprovals /></Suspense> },
          { path: 'reviews', element: <Suspense fallback={<PageLoader />}><AdminReviews /></Suspense> },
          { path: 'tickets', element: <Suspense fallback={<PageLoader />}><AdminTickets /></Suspense> },
          { path: 'marketing', element: <Suspense fallback={<PageLoader />}><AdminMarketing /></Suspense> },
          { path: 'cms', element: <Suspense fallback={<PageLoader />}><AdminCMS /></Suspense> },
          { path: 'seo', element: <Suspense fallback={<PageLoader />}><AdminSEO /></Suspense> },
          { path: 'blog', element: <Suspense fallback={<PageLoader />}><AdminBlog /></Suspense> },
          { path: 'reports', element: <Suspense fallback={<PageLoader />}><AdminReports /></Suspense> },
          { path: 'staff', element: <Suspense fallback={<PageLoader />}><AdminStaff /></Suspense> },
          { path: 'settings', element: <Suspense fallback={<PageLoader />}><AdminSettings /></Suspense> },
        ],
      },
    ],
  },
]);
