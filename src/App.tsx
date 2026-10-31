import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from "react-router";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartPage } from "./pages/CartPage/CartPage";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { ProductPage } from "./pages/ProductPage/ProductPage";
import { OrdersPage } from "./pages/OrdersPage/OrdersPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { WishlistPage } from "./pages/WishlistPage/WishlistPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage/OrderSuccessPage";
import { HelpCenterPage } from "./pages/HelpCenterPage/HelpCenterPage";
import { RealmProvider } from "./context/RealmContext";
import { InventoryProvider } from "./context/InventoryContext";
import { EaglePostWidget } from "./components/EaglePostWidget/EaglePostWidget";
import { MithrilVaultCalculator } from "./components/MithrilVaultCalculator/MithrilVaultCalculator";
import { CouncilChatWidget } from "./components/CouncilSupport/CouncilChatWidget";
import {
  AboutUsPage,
  CancelSubscriptionPage,
  DeliveriesPage,
  GiftCardPage,
  GiftTicketPage,
  GuestPurchasePage,
  OurStoresPage,
  PaymentsPage,
  ReturnGuestPage,
  ReturnsPage,
  SearchReceiptPage,
  ShopOnlinePage,
  WifiConnectionPage,
  WorkWithUsPage,
} from "./pages/FooterPages/FooterPages";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function AppLayout() {
  const { pathname } = useLocation();
  const showEaglePost = pathname !== "/login" && !pathname.startsWith("/login/");

  return (
    <div className="flex min-h-screen flex-col bg-market-paper">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      {showEaglePost && <EaglePostWidget />}
      {showEaglePost && <MithrilVaultCalculator />}
      {showEaglePost && <CouncilChatWidget />}
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-market-ink">Page not found</h1>
      <p className="mt-3 text-market-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-market-ink underline">
        Go to catalog
      </Link>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <RealmProvider>
          <WishlistProvider>
          <InventoryProvider>
          <CartProvider>
            <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
              </Route>
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/help-center" element={<HelpCenterPage />} />
              <Route path="/help/shop-online" element={<ShopOnlinePage />} />
              <Route path="/help/payments" element={<PaymentsPage />} />
              <Route path="/help/deliveries" element={<DeliveriesPage />} />
              <Route path="/help/returns" element={<ReturnsPage />} />
              <Route path="/help/return-guest" element={<ReturnGuestPage />} />
              <Route path="/help/gift-card" element={<GiftCardPage />} />
              <Route path="/help/search-receipt" element={<SearchReceiptPage />} />
              <Route path="/help/guest-purchase" element={<GuestPurchasePage />} />
              <Route path="/help/gift-ticket" element={<GiftTicketPage />} />
              <Route path="/help/wifi-connection" element={<WifiConnectionPage />} />
              <Route path="/help/cancel-subscription" element={<CancelSubscriptionPage />} />
              <Route path="/about/about-us" element={<AboutUsPage />} />
              <Route path="/about/work-with-us" element={<WorkWithUsPage />} />
              <Route path="/about/our-stores" element={<OurStoresPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            </Routes>
          </CartProvider>
          </InventoryProvider>
          </WishlistProvider>
          </RealmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
