import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Views / Pages
import HomePage from './views/HomePage';
import BooksMarketplacePage from './views/BooksMarketplacePage';
import BookDetailsPage from './views/BookDetailsPage';
import SellBookPage from './views/SellBookPage';
import SellerDashboardPage from './views/SellerDashboardPage';
import MyListingsPage from './views/MyListingsPage';
import ChatPage from './views/ChatPage';
import OffersPage from './views/OffersPage';
import ExchangeRequestsPage from './views/ExchangeRequestsPage';
import FavoritesPage from './views/FavoritesPage';
import OrdersPage from './views/OrdersPage';
import SellerProfilePage from './views/SellerProfilePage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ForgotPasswordPage from './views/ForgotPasswordPage';
import UserProfilePage from './views/UserProfilePage';
import SettingsPage from './views/SettingsPage';
import NotificationsPage from './views/NotificationsPage';
import BusinessSellerPage from './views/BusinessSellerPage';
import AdminDashboardPage from './views/AdminDashboardPage';
import SearchPage from './views/SearchPage';
import NotFoundPage from './views/NotFoundPage';
import { AiAssistantWidget } from './components/chat/AiAssistantWidget';
import OAuthSuccessPage from './views/OAuthSuccessPage';
import { BackendKeepAlive } from './components/common/BackendKeepAlive';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MarketplaceProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden w-full max-w-full">
              <ScrollToTop />
              <BackendKeepAlive />
              <Navbar />

              <main className="flex-1 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
                <Routes>
                  {/* Public Marketplace routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books" element={<BooksMarketplacePage />} />
                  <Route path="/books/:id" element={<BookDetailsPage />} />
                  <Route path="/seller/:id" element={<SellerProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Authenticated / User & Seller Operations */}
                  <Route
                      path="/oauth2/success"
                      element={<OAuthSuccessPage />}
                    />
                  <Route
                    path="/sell"
                    element={
                      <ProtectedRoute>
                        <SellBookPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <SellerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/listings"
                    element={
                      <ProtectedRoute>
                        <MyListingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat/:id"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/offers"
                    element={
                      <ProtectedRoute>
                        <OffersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/exchanges"
                    element={
                      <ProtectedRoute>
                        <ExchangeRequestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Professional Portal & Admin */}
                  <Route path="/business" element={<BusinessSellerPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />

                  {/* Catch all 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <AiAssistantWidget />
              <BottomNav />
              <Footer />
            </div>
          </MarketplaceProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
