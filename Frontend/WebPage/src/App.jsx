import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './lib/cart-context';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { CartDrawer } from './components/CartDrawer';
import { useSettings } from './context/SettingsContext';
import Loader from './components/Loader';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const BestSellersPage = lazy(() => import('./pages/BestSellersPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

function AppContent() {
  const { isLoading } = useSettings();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <SiteHeader />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/best-sellers" element={<BestSellersPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Suspense>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <SettingsProvider>
          <Router>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </Router>
        </SettingsProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
