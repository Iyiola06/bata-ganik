import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StorefrontLayout from './layouts/StorefrontLayout';
import Home from './pages/storefront/Home';
import Collections from './pages/storefront/Collections';
import ProductDetail from './pages/storefront/ProductDetail';
import Contact from './pages/storefront/Contact';
import OrderConfirmation from './pages/storefront/OrderConfirmation';
import Checkout from './pages/storefront/Checkout';
import Account from './pages/storefront/Account';
import ShippingReturns from './pages/storefront/ShippingReturns';
import SizeGuide from './pages/storefront/SizeGuide';
import FAQ from './pages/storefront/FAQ';
import CareInstructions from './pages/storefront/CareInstructions';
import PrivacyPolicy from './pages/storefront/PrivacyPolicy';
import TermsOfService from './pages/storefront/TermsOfService';
import Catalog from './pages/storefront/Catalog';
import OurStory from './pages/storefront/OurStory';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import Orders from './pages/admin/Orders';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex-1 p-10 flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">This page is under construction.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Storefront Routes */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/shop" element={<Catalog />} />
          <Route path="/shop/:category" element={<Catalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/care-instructions" element={<CareInstructions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/our-story" element={<OurStory />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Placeholder title="Customers" />} />
          <Route path="analytics" element={<Placeholder title="Analytics" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
