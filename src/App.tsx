import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RealmProvider } from "./context/RealmContext";
import { InventoryProvider } from "./context/InventoryContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { FloatingWidgetDock } from "./components/FloatingWidgets/FloatingWidgetDock";
import { WidgetProvider } from "./context/WidgetContext";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { BottomNav } from "./components/Navigation/BottomNav";

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage").then((module) => ({ default: module.LoginPage })));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage").then((module) => ({ default: module.ProductPage })));
const CartPage = lazy(() => import("./pages/CartPage/CartPage").then((module) => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage/CheckoutPage").then((module) => ({ default: module.CheckoutPage })));
const OrdersPage = lazy(() => import("./pages/OrdersPage/OrdersPage").then((module) => ({ default: module.OrdersPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage").then((module) => ({ default: module.WishlistPage })));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage/OrderSuccessPage").then((module) => ({ default: module.OrderSuccessPage })));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage/HelpCenterPage").then((module) => ({ default: module.HelpCenterPage })));
const ShopOnlinePage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.ShopOnlinePage })));
const PaymentsPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.PaymentsPage })));
const DeliveriesPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.DeliveriesPage })));
const ReturnsPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.ReturnsPage })));
const ReturnGuestPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.ReturnGuestPage })));
const GiftCardPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.GiftCardPage })));
const SearchReceiptPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.SearchReceiptPage })));
const GuestPurchasePage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.GuestPurchasePage })));
const GiftTicketPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.GiftTicketPage })));
const WifiConnectionPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.WifiConnectionPage })));
const CancelSubscriptionPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.CancelSubscriptionPage })));
const AboutUsPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.AboutUsPage })));
const WorkWithUsPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.WorkWithUsPage })));
const OurStoresPage = lazy(() => import("./pages/FooterPages/FooterPages").then((module) => ({ default: module.OurStoresPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

// ყველა მარშრუტისთვის საერთო Header-სა და Footer-ს აწყობს.
function AppLayout() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-market-paper pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <Header />
        <div className="flex-1">
          <Suspense fallback={<main className="mx-auto w-full max-w-7xl px-4 py-16 text-center text-sm text-market-muted" role="status" aria-live="polite">Loading page…</main>}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
      <BottomNav />
      <FloatingWidgetDock />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      {/* საერთო მდგომარეობის პროვაიდერები მარშრუტების შიგნით არსებულ გვერდებს უზიარებენ მონაცემებს. */}
      <AuthProvider>
        <ToastProvider>
          <RealmProvider>
          <WidgetProvider>
          <WishlistProvider>
          <InventoryProvider>
          <CartProvider>
            {/* მარშრუტები საერთო Layout-ს იყენებს; ანგარიშისა და checkout-ის გვერდები დაცულია. */}
            <ErrorBoundary>
            <ScrollToTop />
            <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrdersPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
              </Route>
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
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
            </ErrorBoundary>
          </CartProvider>
          </InventoryProvider>
          </WishlistProvider>
          </WidgetProvider>
          </RealmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
