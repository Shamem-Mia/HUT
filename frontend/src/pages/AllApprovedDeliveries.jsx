import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import {
  MapPin,
  Clock,
  User,
  Store,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  CheckCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const AllApprovedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    shop: "all",
    sort: "newest",
  });
  const [expandedDelivery, setExpandedDelivery] = useState(null);
  const [cardShow, setCardShow] = useState(false);

  // console.log("deliveries", deliveries);
  const isFilterCardShowing = () => {
    try {
      setCardShow(!cardShow);
    } catch (error) {
      console.log(error.message);
    }
  };

  const verifyDelivery = async (deliveryId) => {
    if (!pin || pin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      const deliveryToVerify = deliveries.find((d) => d._id === deliveryId);
      if (!deliveryToVerify) {
        toast.error("Delivery not found");
        return;
      }
      // console.log("deliveryToVerify:", deliveryToVerify);

      await axiosInstance.put(`/deliveries/${deliveryId}/verify`, {
        pin,
        shopId: deliveryToVerify.shop?._id,
      });
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((d) =>
          d._id === deliveryId ? { ...d, status: "delivered" } : d
        )
      );
      setPin("");
      setActiveDelivery(null);
      toast.success("Delivery verified successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify delivery");
    }
  };

  const fetchAllApprovedDeliveries = async () => {
    try {
      let url = "/deliveries/admin/approved";
      setLoading(true);
      // Add query params if filters are active
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.shop !== "all") params.append("shop", filters.shop);
      if (filters.sort !== "newest") params.append("sort", filters.sort);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axiosInstance.get(url);
      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Failed to fetch approved deliveries:", error);
      toast.error(error?.message || "Failed to fetch approved deliveries");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (verifiedAt) => {
    if (!verifiedAt) return "0h 0m";

    const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const timePassed = Date.now() - new Date(verifiedAt).getTime();
    const timeLeft = THREE_HOURS - timePassed;

    if (timeLeft <= 0) return "0h 0m"; // Already expired

    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursLeft}h ${minutesLeft}m`;
  };

  const toggleExpandDelivery = (deliveryId) => {
    setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
  };

  useEffect(() => {
    fetchAllApprovedDeliveries();
  }, [filters]);

  // Extract unique shops and statuses for filter dropdowns
  const uniqueShops = [
    ...new Set(deliveries.map((d) => d.shop?.shopName).filter(Boolean)),
  ];

  const statusCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.status] = (acc[delivery.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-orange-600">
          All Approved Deliveries
        </h1>

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
                e.key === "Enter" && fetchAllApprovedDeliveries()
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="all">
                      All Statuses ({deliveries.length})
                    </option>
                    <option value="approved">
                      Approved ({statusCounts.approved || 0})
                    </option>
                    <option value="delivered">
                      Delivered ({statusCounts.delivered || 0})
                    </option>
                  </select>
                </div>

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
                      <option key={shop} value={shop}>
                        {shop}
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
          <p className="text-orange-700 text-lg">
            No approved deliveries found
          </p>
          {(searchTerm ||
            filters.status !== "all" ||
            filters.shop !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  status: "all",
                  shop: "all",
                  sort: "newest",
                });
                fetchAllApprovedDeliveries();
              }}
              className="mt-4 text-orange-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Deliveries</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {deliveries.length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statusCounts.approved || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Delivered</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {statusCounts.delivered || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery._id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                  delivery.status === "delivered"
                    ? "border-green-100"
                    : "border-orange-100"
                } hover:shadow-lg transition-shadow duration-300`}
              >
                {/* Delivery Header */}
                <div
                  className={`px-6 py-4 cursor-pointer ${
                    delivery.status === "delivered"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-orange-500 to-amber-500"
                  }`}
                  onClick={() => toggleExpandDelivery(delivery._id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Store className="h-5 w-5 text-white mr-2" />
                        <h2 className="text-lg font-semibold text-white">
                          {delivery.shop?.shopName || "Shop"}
                        </h2>
                      </div>
                      <div className="flex items-center sm:pr-2">
                        {/* Timer moved here, outside the status badge */}
                        {delivery.status === "delivered" && (
                          <div className="text-xs text-white bg-black bg-opacity-20 px-2 py-1 rounded">
                            Auto-deletes in:{" "}
                            {calculateTimeLeft(delivery.verifiedAt)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          delivery.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {delivery.status.toUpperCase()}
                      </span>
                      <span className="text-lg font-bold text-white">
                        ৳{delivery.payment?.amount?.toFixed(2)}
                      </span>
                      {expandedDelivery === delivery._id ? (
                        <ChevronUp className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {expandedDelivery === delivery._id && (
                  <div className="divide-y divide-gray-100">
                    {/* Order Items */}
                    <div className="px-6 py-4">
                      <h3 className="font-medium text-lg text-gray-800 flex items-center mb-3">
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
                      <div className=" flex flex-row font-semibold justify-between p-2">
                        <p className=" text-2xl text-start text-orange-500">
                          Total :{" "}
                        </p>
                        <p className="text-2xl text-end text-orange-500">
                          {" "}
                          ৳{delivery?.payment?.amount}
                        </p>
                      </div>
                    </div>

                    {/* Delivery and Payment Information */}
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delivery Information */}
                        <div>
                          <h3 className="font-medium text-lg text-gray-800 flex items-center mb-3">
                            <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                            Delivery Information
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

                          <div className="mt-4">
                            <h3 className="font-medium text-lg text-gray-800 flex items-center mb-2">
                              <Clock className="w-5 h-5 mr-2 text-orange-500" />
                              Delivery Time
                            </h3>
                            <p className="text-gray-700">
                              {delivery.deliveryDetails?.deliveryDate &&
                                new Date(
                                  delivery.deliveryDetails.deliveryDate
                                ).toLocaleDateString()}{" "}
                              at {delivery.deliveryDetails?.deliveryTime}
                            </p>
                          </div>
                        </div>

                        {/* Payment and Status Information */}
                        <div>
                          <h3 className="font-medium text-lg text-gray-800 flex items-center mb-3">
                            <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
                            Payment Information
                          </h3>
                          <div className="space-y-2 text-gray-700">
                            <p>
                              <span className="font-medium text-amber-600">
                                Method:
                              </span>{" "}
                              {delivery.payment?.method?.toUpperCase()}
                            </p>
                            <p>
                              <span className="font-medium text-amber-600">
                                Amount:
                              </span>{" "}
                              ৳{delivery.payment?.amount?.toFixed(2)}
                            </p>
                            <p>
                              <span className="font-medium text-amber-600">
                                Payment Number:
                              </span>{" "}
                              {delivery.payment?.paymentNumber ||
                                "Not Provided"}
                            </p>
                            <p>
                              <span className="font-medium text-amber-600">
                                Transaction ID:
                              </span>{" "}
                              {delivery.payment?.transactionId}
                            </p>
                          </div>

                          <div className="mt-4">
                            <h3 className="font-medium text-lg text-gray-800 flex items-center mb-2">
                              <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                              Status Timeline
                            </h3>
                            <div className="space-y-2 text-gray-700">
                              <p>
                                <span className="font-medium text-amber-600">
                                  Created:
                                </span>{" "}
                                {new Date(delivery.createdAt).toLocaleString()}
                              </p>
                              {/* {delivery.status === "approved" &&
                                delivery.deliveryPin && (
                                  <p>
                                    <span className="font-medium text-amber-600">
                                      Approved with PIN:
                                    </span>{" "}
                                    {delivery.deliveryPin}
                                  </p>
                                )} */}
                              {delivery.status === "delivered" && (
                                <>
                                  <p>
                                    <span className="font-medium text-amber-600">
                                      Delivered at:
                                    </span>{" "}
                                    {new Date(
                                      delivery.deliveredAt
                                    ).toLocaleString()}
                                  </p>
                                  <p>
                                    <span className="font-medium text-amber-600">
                                      Verified at:
                                    </span>{" "}
                                    {new Date(
                                      delivery.verifiedAt
                                    ).toLocaleString()}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Section - Moved inside the delivery item */}
                    {delivery.status === "approved" && (
                      <div className="px-6 pb-6 text-center">
                        <div className="bg-orange-50 rounded-lg p-4 inline-block">
                          <h3 className="font-medium text-orange-700 mb-2">
                            Verify Delivery
                          </h3>
                          <div className="flex justify-center items-center space-x-2">
                            <input
                              type="text"
                              maxLength="4"
                              placeholder="Enter PIN"
                              className="border border-orange-300 rounded-lg px-3 py-2 w-24 text-center focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              value={activeDelivery === delivery._id ? pin : ""}
                              onChange={(e) =>
                                setPin(e.target.value.replace(/\D/g, ""))
                              }
                              onFocus={() => setActiveDelivery(delivery._id)}
                            />
                            <button
                              onClick={() => verifyDelivery(delivery._id)}
                              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
                            >
                              <CheckCircle size={18} className="inline mr-1" />
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApprovedDeliveries;
