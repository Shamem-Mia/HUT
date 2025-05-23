import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import {
  Home,
  Package,
  Clock,
  CheckCircle,
  User,
  ShoppingBag,
} from "lucide-react";
import Footer from "../components/Footer";

const MyHUT = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            MyHUT Dashboard
          </h1>
          <p className="text-orange-500">Manage your shop and deliveries</p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Home Card */}
          <Link
            to={authUser?.role === "user" ? "/delivery-man-request" : "/"}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-orange-500 hover:border-orange-600"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <Home size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {authUser?.role === "user" ? "Request for Job" : "Home"}
              </h2>
            </div>
            <p className="mt-2 text-gray-600">
              {authUser?.role === "user"
                ? "Apply as a delivery man"
                : "Return to homepage"}
            </p>
          </Link>

          {/* Shop Owner Cards */}

          {authUser && authUser?.role === "shop-owner" && (
            <>
              <Link
                to="/owner-dashboard"
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500 hover:border-blue-600"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <ShoppingBag size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Shop
                  </h2>
                </div>
                <p className="mt-2 text-gray-600">
                  Manage your shop activities
                </p>
              </Link>
            </>
          )}
          {authUser &&
            (authUser?.role === "shop-owner" ||
              authUser?.role === "admin" ||
              authUser?.role === "delivery-man") && (
              <>
                <Link
                  to={
                    authUser?.role === "shop-owner"
                      ? "/shop-pending-deliveries"
                      : authUser?.role === "admin" ||
                        authUser?.role === "delivery-man"
                      ? "/pending/all-deliveries-admin"
                      : ""
                  }
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-amber-500 hover:border-amber-600"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                      <Clock size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      All Pending Deliveries
                    </h2>
                  </div>
                  <p className="mt-2 text-gray-600">
                    Review and approve orders
                  </p>
                </Link>

                <Link
                  to={
                    authUser?.role === "shop-owner"
                      ? "/shop-deliveries"
                      : authUser?.role === "admin"
                      ? "/approved/all-deliveries-admin"
                      : authUser?.role === "delivery-man"
                      ? "/approved/delivery-man-deliveries"
                      : ""
                  }
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500 hover:border-green-600"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <Package size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {authUser?.role === "shop-owner"
                        ? "Verify Delivery"
                        : authUser?.role === "admin"
                        ? "All Delivery to verify"
                        : authUser?.role === "delivery-man"
                        ? "Verify Your delivery"
                        : ""}
                    </h2>
                  </div>
                  <p className="mt-2 text-gray-600">
                    View all deliveries to verify
                  </p>
                </Link>
              </>
            )}

          {/* Delivery History Card */}
          <Link
            to="/user-delivery-history"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-purple-500 hover:border-purple-600"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <CheckCircle size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
            </div>
            <p className="mt-2 text-gray-600">Track your order history</p>
          </Link>
          {/* Profile Card */}
          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-red-500 hover:border-red-600"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <User size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                My Profile
              </h2>
            </div>
            <p className="mt-2 text-gray-600">Manage your account settings</p>
          </Link>
          {/* delivery man request */}
          {authUser?.role === "admin" && (
            <Link
              to="/pending/delivery-man-request"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-red-500 hover:border-red-600"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <User size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Pending Job
                </h2>
              </div>
              <p className="mt-2 text-gray-600">Accept or Reject Job</p>
            </Link>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Outlet />
        </div>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MyHUT;
