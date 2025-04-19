import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useAuthStore } from "./stores/useAuthStore";
import toast, { Toaster } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ShopOwnerRequestPage from "./pages/ShopOwnerRequestPage";
import AdminShopRequestsPage from "./pages/AdminShopRequestsPage";
import FoodMenuPage from "./pages/FoodMenuPage";
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ShopFoodItemsPage from "./pages/ShopFoodItemsPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyHUT from "./pages/MyHUT";
import ShopDeliveries from "./pages/ShopDeliveries";
import ShopPendingDeliveries from "./pages/ShopPendingDeliveries";
import UserDeliveryHistory from "./pages/UserDeliveryHistory";
import { getGuestKey } from "./context/guestUser";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AboutPage from "./pages/AboutPage";
import DeveloperDescriptionPage from "./pages/DeveloperDescriptionPage";
import ShopOwnConfPage from "./pages/ShopOwnConfPage";
import AdminShopEdit from "./pages/AdminShopEdit";
import ProfilePage from "./pages/ProfilePage";
import AllApprovedDeliveries from "./pages/AllApprovedDeliveries";
import AllPendingDeliveries from "./pages/AllPendingDeliveries";
import GetDeliveryManRequestsAdmin from "./pages/GetDeliveryManRequestsAdmin";
import DeliveryManRequest from "./pages/DeliveryManRequest";
import DeliveryManDeliveries from "./pages/DeliveryManDeliveries";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const guestKey = getGuestKey();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();

    // Redirect logic after auth check completes
    if (!isCheckingAuth) {
      const currentPath = window.location.pathname;
      const publicRoutes = [
        "/login",
        "/register",
        "/guest-entry",
        "/verify-email",
        "/forgot-password",
        "/verify-otp",
        "/reset-password",
      ];

      // If no auth and no guest key, and not on a public route, redirect to login
      if (!authUser && !guestKey && !publicRoutes.includes(currentPath)) {
        navigate("/login");
      }

      // If already authenticated or has guest key and tries to access login/guest-entry, redirect home
      if (
        (authUser || guestKey) &&
        (currentPath === "/login" || currentPath === "/guest-entry")
      ) {
        navigate("/");
      }
    }
  }, [isCheckingAuth, authUser?.id, guestKey]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className=" size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            authUser || guestKey ? <HomePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* shop owner request */}

        <Route
          path="/shop-ownership-request"
          element={
            authUser ? (
              <ShopOwnerRequestPage />
            ) : (
              <Navigate to="/unauthorized" />
            )
          }
        />
        <Route
          path="/get-shop-ownership-request"
          element={
            authUser && authUser.role === "admin" ? (
              <AdminShopRequestsPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* food items route */}

        <Route
          path="/owner-dashboard"
          element={
            authUser &&
            (authUser.role === "shop-owner" || authUser.role === "admin") ? (
              <ShopOwnerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/go-to-hut" element={<FoodMenuPage />} />

        <Route path="/shop/:id/food-items" element={<ShopFoodItemsPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-hut" element={<MyHUT />} />
        <Route
          path="/shop-deliveries"
          element={
            authUser?.role === "shop-owner" ? (
              <ShopDeliveries />
            ) : (
              <div className="flex items-center justify-center h-screen">
                <h3 className="text-2xl font-semibold text-red-500">
                  Unauthorized!!
                </h3>
              </div>
            )
          }
        />
        <Route
          path="/shop-pending-deliveries"
          element={
            authUser?.role === "shop-owner" ? (
              <ShopPendingDeliveries />
            ) : (
              <div className="flex items-center justify-center h-screen">
                <h3 className="text-2xl font-semibold text-red-500">
                  Unauthorized!!
                </h3>

                <h1 className="text-2xl font-semibold text-red-500">FREE!</h1>
                <h3 className="text-2xl font-semibold text-red-500">
                  Open your own Shop
                </h3>
              </div>
            )
          }
        />
        <Route
          path="/user-delivery-history"
          element={<UserDeliveryHistory />}
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/about"
          element={
            authUser || guestKey ? <AboutPage /> : <Navigate to="/login" />
          }
        />
        <Route path="/developer-info" element={<DeveloperDescriptionPage />} />
        <Route path="/shop-owner-confirmation" element={<ShopOwnConfPage />} />
        <Route path="/admin/shops/:shopId/edit" element={<AdminShopEdit />} />
        <Route
          path="/profile"
          element={
            authUser || guestKey ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" state={{ from: "/profile" }} />
            )
          }
        />
        <Route
          path="/approved/all-deliveries-admin"
          element={
            authUser &&
            (authUser.role === "admin" || authUser.role === "delivery-man") ? (
              <AllApprovedDeliveries />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/pending/all-deliveries-admin"
          element={
            authUser &&
            (authUser.role === "admin" || authUser.role === "delivery-man") ? (
              <AllPendingDeliveries />
            ) : (
              <Navigate to="/unauthorized" />
            )
          }
        />
        <Route
          path="/approved/delivery-man-deliveries"
          element={
            authUser &&
            (authUser.role === "admin" || authUser.role === "delivery-man") ? (
              <DeliveryManDeliveries />
            ) : (
              <Navigate to="/unauthorized" />
            )
          }
        />
        <Route
          path="/pending/delivery-man-request"
          element={
            authUser && authUser.role === "admin" ? (
              <GetDeliveryManRequestsAdmin />
            ) : (
              <Navigate to="/unauthorized" />
            )
          }
        />
        <Route
          path="/delivery-man-request"
          element={
            authUser ? <DeliveryManRequest /> : <Navigate to="/unauthorized" />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
