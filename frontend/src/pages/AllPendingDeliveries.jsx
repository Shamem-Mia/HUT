import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Package,
  Store,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AllPendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    shop: "all",
    sort: "newest",
  });
  const [cardShow, setCardShow] = useState(false);
  const [expandedDelivery, setExpandedDelivery] = useState(null);

  const isFilterCardShowing = () => {
    try {
      setCardShow(!cardShow);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchAllPendingDeliveries = async () => {
    try {
      setLoading(true);
      let url = "/deliveries/admin/pending";
      // Add query params if filters are active
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filters.shop !== "all") params.append("shop", filters.shop);
      if (filters.sort !== "newest") params.append("sort", filters.sort);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axiosInstance.get(url);

      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Failed to fetch pending deliveries:", error);
      toast.error("Failed to fetch pending deliveries");
    } finally {
      setLoading(false);
    }
  };

  const approveDelivery = async (deliveryId) => {
    try {
      await axiosInstance.put(`/deliveries/admin/${deliveryId}/approve`);
      fetchAllPendingDeliveries();
      toast.success("Delivery approved successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve delivery"
      );
    }
  };

  const rejectDelivery = async (deliveryId) => {
    try {
      await axiosInstance.delete(`/deliveries/admin/${deliveryId}/reject`);
      fetchAllPendingDeliveries();
      toast.success("Delivery rejected successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject delivery");
    }
  };

  const toggleExpandDelivery = (deliveryId) => {
    setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchAllPendingDeliveries();
    }, 400); // delay for user to stop typing

    return () => clearTimeout(debounce);
  }, [filters, searchTerm]);

  // Extract unique shops for filter dropdown
  const uniqueShops = [
    ...new Map(deliveries.map((d) => [d.shop?._id, d.shop])).values(),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-orange-600">
          All Pending Delivery Requests
        </h1>

        <Link
          to="/approved/delivery-man-deliveries"
          className="flex items-center gap-2 text-orange-700 hover:text-orange-700 transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Verify your deliveries</span>
        </Link>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deliveries..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && fetchAllPendingDeliveries()
              }
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={isFilterCardShowing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {cardShow && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.shop}
                    onChange={(e) =>
                      setFilters({ ...filters, shop: e.target.value })
                    }
                  >
                    <option value="all">All Shops</option>
                    {uniqueShops.map((shop) => (
                      <option key={shop._id} value={shop._id}>
                        {shop.shopName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters({ ...filters, sort: e.target.value })
                    }
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Amount (High to Low)</option>
                    <option value="amount-low">Amount (Low to High)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-orange-50 rounded-xl p-8 text-center">
          <p className="text-orange-700 text-lg">No pending deliveries found</p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                fetchAllPendingDeliveries();
              }}
              className="mt-4 text-orange-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Delivery Header */}
              <div
                className="bg-gradient-to-r from-orange-100 to-amber-200 px-6 py-4 border-b border-orange-600 cursor-pointer"
                onClick={() => toggleExpandDelivery(delivery._id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Store className="h-5 w-5 text-orange-600 mr-2" />
                      <h2 className="text-lg font-semibold text-orange-700">
                        {delivery.shop?.shopName || "Shop"}
                      </h2>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-orange-600 mr-2" />
                      <p className="text-sm text-orange-800">
                        {delivery.user?.name || "Guest"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                      Pending
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      ৳{delivery.payment?.amount?.toFixed(2)}
                    </span>
                    {expandedDelivery === delivery._id ? (
                      <ChevronUp className="h-5 w-5 text-orange-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              {expandedDelivery === delivery._id && (
                <div className="divide-y divide-orange-50">
                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <h3 className="font-medium text-lg text-orange-700 flex items-center mb-3">
                      <Package className="w-5 h-5 mr-2 text-orange-500" />
                      Order Items ({delivery.items?.length || 0})
                    </h3>
                    <ul className="space-y-3">
                      {delivery.items?.map((item, index) => (
                        <li
                          key={index}
                          className="py-2 flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg border border-orange-100"
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.quantity}x {item.name}
                              </p>
                              <div className="flex gap-3 text-sm">
                                <span className="text-amber-600">
                                  {item.category}
                                </span>
                                <span className="text-gray-500">
                                  ৳{item.price.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="font-medium text-orange-600">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Delivery Information */}
                  <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Delivery Address */}
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <h3 className="font-medium text-orange-700 text-lg flex items-center mb-2">
                          <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                          Delivery Address
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <p>
                            <span className="font-medium text-amber-600">
                              Location:
                            </span>{" "}
                            {delivery.deliveryDetails?.universityOrVillage}
                          </p>
                          <p>
                            <span className="font-medium text-amber-600">
                              Hall/Moholla:
                            </span>{" "}
                            {delivery.deliveryDetails?.hallOrMoholla}
                          </p>
                          <p>
                            <span className="font-medium text-amber-600">
                              Room/Identity:
                            </span>{" "}
                            {delivery.deliveryDetails?.roomOrIdentity}
                          </p>
                          <p>
                            <span className="font-medium text-amber-600">
                              Contact:
                            </span>{" "}
                            {"0" + delivery.deliveryDetails?.contactNumber}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Time and Payment */}
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                          <h3 className="font-medium text-orange-700 flex items-center mb-2">
                            <Clock className="w-5 h-5 mr-2 text-orange-500" />
                            Delivery Time
                          </h3>
                          <p className="text-sm text-gray-700">
                            {delivery.deliveryDetails?.deliveryDate &&
                              new Date(
                                delivery.deliveryDetails.deliveryDate
                              ).toLocaleDateString()}{" "}
                            at {delivery.deliveryDetails?.deliveryTime}
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                          <h3 className="font-medium text-orange-700 mb-2">
                            Payment Information
                          </h3>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p>
                              <span className="font-medium text-amber-600">
                                Method:
                              </span>{" "}
                              {delivery.payment?.method?.toUpperCase()}
                            </p>
                            <p>
                              <span className="font-medium text-amber-600">
                                Transaction ID:
                              </span>{" "}
                              {delivery.payment?.transactionId}
                            </p>
                            <p>
                              <span className="font-medium text-amber-600">
                                Payment Number:
                              </span>{" "}
                              0{delivery.payment?.paymentNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-white flex justify-end gap-4">
                    <button
                      onClick={() => rejectDelivery(delivery._id)}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors shadow-sm"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => approveDelivery(delivery._id)}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPendingDeliveries;
