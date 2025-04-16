import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, AlertCircle, Store, Edit, Loader } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";

const AdminShopSearch = () => {
  const [shopPin, setShopPin] = useState("");
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get auth info from Zustand store
  const { authUser } = useAuthStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!shopPin) {
      setError("Please enter a shop PIN");
      toast.error("Please enter a shop PIN");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await axiosInstance.get(`/shops/pin/${shopPin}`);

      if (!data) {
        throw new Error("Shop not found");
      }

      setShop(data);
      toast.success("Shop found successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch shop";
      setError(errorMessage);
      setShop(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setShopPin("");
    setShop(null);
    setError("");
  };

  const handleEditShop = (shopId) => {
    navigate(`/admin/shops/${shopId}/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Store className="text-blue-500" /> Shop Search
      </h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="number"
              value={shopPin}
              onChange={(e) => setShopPin(e.target.value)}
              placeholder="Enter Shop PIN (e.g., 56200)"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {shopPin && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader size={20} /> Searching...
              </>
            ) : (
              <>
                <Search size={20} /> Search
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {shop && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{shop.shopName}</h2>
            <p className="text-gray-600">{shop.shopCategory}</p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shop Details</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-600">PIN:</span>{" "}
                  <span className="font-medium">{shop.shopPin}</span>
                </li>
                <li>
                  <span className="text-gray-600">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shop.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : shop.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {shop.status}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">Contact:</span>{" "}
                  <span className="font-medium">
                    {"0" + shop.contactNumber}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">Bkash:</span>{" "}
                  <span className="font-medium">{"0" + shop.BkashNumber}</span>
                </li>
                <li>
                  <span className="text-gray-600">Nagad:</span>{" "}
                  <span className="font-medium">{"0" + shop.NagadNumber}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-600">Address:</span>{" "}
                  <span className="font-medium">{shop.permanentAddress}</span>
                </li>
                <li>
                  <span className="text-gray-600">Local Areas:</span>{" "}
                  <span className="font-medium">
                    {shop.localAreas.join(", ")}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">Delivery Charges:</span>{" "}
                  <span className="font-medium">
                    {Array.isArray(shop.deliveryCharge)
                      ? shop.deliveryCharge.join(", ") + " Tk"
                      : "Not specified"}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">Total Deliveries:</span>{" "}
                  <span className="font-medium">{shop.deliveryCount || 0}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
            <button
              onClick={() => handleEditShop(shop._id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit size={16} /> Edit Shop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShopSearch;
