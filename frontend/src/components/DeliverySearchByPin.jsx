import { use, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import {
  Package,
  CheckCircle,
  MapPin,
  Clock,
  ShoppingBasket,
} from "lucide-react";
import toast from "react-hot-toast";

const DeliverySearchByPin = ({ onSearchComplete }) => {
  const [pin, setPin] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pin || pin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/deliveries/pin/${pin}`);
      setSearchResult(response.data.delivery);
      setUser(response.data.user);

      toast.success("Delivery found!");
      if (onSearchComplete) onSearchComplete(response.data);
    } catch (err) {
      setSearchResult(null);
      toast.error(err.response?.data?.message || "Delivery not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label
            htmlFor="deliveryPin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Delivery by delivery PIN
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="deliveryPin"
              maxLength="4"
              placeholder="Enter 4-digit PIN"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {searchResult && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
          {/* Delivery Header */}
          <div className="flex items-center space-x-3">
            <Package className="text-orange-500" />
            <div>
              <h3 className="font-medium text-orange-700">
                Delivery #{user._id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(searchResult.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                searchResult.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : searchResult.status === "approved"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {searchResult.status.toUpperCase()}
            </span>
          </div>

          {/* Delivery Summary */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer and Shop Info */}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{user.fullName || "Guest"}</p>
                <p className="font-medium">{user.email || "guest@gmail.com"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shop</p>
                <p className="font-medium">
                  {searchResult.shop?.shopName || "Unknown Shop"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-orange-600">
                  ৳{searchResult.payment?.amount?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="capitalize font-medium">
                  {searchResult.payment?.method}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono font-medium">
                  {searchResult.payment?.transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-orange-100">
            <div className="flex items-center space-x-2 text-orange-600 mb-2">
              <MapPin size={16} />
              <h4 className="font-medium">Delivery Address</h4>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-500">Location:</span>{" "}
                {searchResult.deliveryDetails?.universityOrVillage}
              </p>
              <p>
                <span className="text-gray-500">Hall/Moholla:</span>{" "}
                {searchResult.deliveryDetails?.hallOrMoholla}
              </p>
              <p>
                <span className="text-gray-500">Room/Identity:</span>{" "}
                {searchResult.deliveryDetails?.roomOrIdentity}
              </p>
              <p>
                <span className="text-gray-500">Contact:</span>{" "}
                {searchResult.deliveryDetails?.contactNumber}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-orange-600 mt-3 mb-2">
              <Clock size={16} />
              <h4 className="font-medium">Delivery Time</h4>
            </div>
            <div className="text-sm">
              <p>
                {searchResult.deliveryDetails?.deliveryDate &&
                  new Date(
                    searchResult.deliveryDetails.deliveryDate
                  ).toLocaleDateString()}{" "}
                at {searchResult.deliveryDetails?.deliveryTime}
              </p>
              {searchResult.deliveredAt && (
                <p className="text-green-600 mt-1">
                  Delivered at:{" "}
                  {new Date(searchResult.deliveredAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-orange-600 mb-2">
              <ShoppingBasket size={16} />
              <h4 className="font-medium">Order Items</h4>
            </div>
            <ul className="space-y-2">
              {searchResult.items?.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded border border-orange-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 w-8 h-8 rounded flex items-center justify-center">
                      <span className="text-orange-600 text-sm font-medium">
                        {item.quantity}x
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {searchResult.status === "approved" && (
            <button
              onClick={() => {
                if (onSearchComplete) onSearchComplete(searchResult);
              }}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="mr-2" size={16} />
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliverySearchByPin;
