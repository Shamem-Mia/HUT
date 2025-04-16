import { ChevronDown, ChevronUp, Star, Store } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";

const ShopDetailsCard = ({ shop, refreshShopData }) => {
  const { authUser } = useAuthStore();
  const [isCharge, setIsCharge] = useState(false);

  const [charges, setCharges] = useState(() => {
    if (!shop) return [];
    if (Array.isArray(shop.deliveryCharge)) {
      return [...shop.deliveryCharge];
    }
    return Array(shop.localAreas?.length || 0).fill(0);
  });

  const handleResetStats = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/shops/${shop._id}/reset-stats`
      );
      if (data) {
        toast.success("Shop stats reset successfully!");
        // You might want to refresh the shop data here
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset stats. Please try again."
      );
    }
  };

  // open or close shop

  const handleToggleShopStatus = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/shops/${shop._id}/toggle-status`
      );
      if (data) {
        toast.success(`Shop is now ${data.isOpen ? "open" : "closed"}`);
        refreshShopData();
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to toggle shop status. Please try again."
      );
    }
  };

  const handleChargeChange = (index, value) => {
    const updated = [...charges];
    updated[index] = Number(value) || 0;
    setCharges(updated);
  };

  const handleSaveCharges = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/shops/${shop._id}/delivery-charge`,
        {
          deliveryCharge: charges,
        }
      );
      if (data) {
        setCharges([]);
        setIsCharge(!isCharge);
      }
      toast.success("Delivery charges updated!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to update charges. Please try again."
      );
    }
  };

  if (!shop) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg overflow-hidden mb-8 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Shop Info */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <Store size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{shop.shopName}</h1>
            <p className="text-lg font-semibold text-white/80">
              {authUser.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm text-white">
                {shop.shopCategory}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm text-white flex items-center">
                <Star size={14} className="mr-1 text-yellow-300" />
                {shop.rating?.average?.toFixed(1) || "New"}
              </span>
            </div>
          </div>
        </div>

        {/* shop open close toggle button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleToggleShopStatus}
            className={`relative w-16 h-8 rounded-full p-1 transition-all duration-100 focus:outline-none ${
              shop.isOpen ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div className="flex items-center justify-between px-1 h-full w-full">
              <span
                className={`text-xs font-medium ${
                  shop.isOpen
                    ? "text-white opacity-0"
                    : "text-white opacity-100"
                } transition-opacity duration-100`}
              >
                Off
              </span>
              <span
                className={`text-xs font-medium ${
                  shop.isOpen
                    ? "text-white opacity-100"
                    : "text-white opacity-0"
                } transition-opacity duration-100`}
              >
                On
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <p className="text-sm font-medium">Deliveries</p>
              <p className="text-2xl font-bold py-5">
                {shop.deliveryCount || 0}
              </p>
            </div>
            <div className="text-center">
              <div className=" flex flex-row gap-2 items-center justify-center">
                <p className="text-sm font-medium">Total Sell</p>
                <p className="text-lg opacity-80 text-white">
                  ({shop.sellDays || 0} days)
                </p>
              </div>
              <p className="text-2xl font-bold">
                {shop.totalSellPrice || 0} tk
              </p>

              <div className="text-center flex flex-col items-center pt-3">
                <button
                  onClick={handleResetStats}
                  className=" bg-orange-700 hover:bg-white/30 text-white text-xs px-2 py-1 rounded-lg transition-colors"
                >
                  Reset Stats
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Contact</p>
              <p className="text-2xl font-semibold py-5">
                {"0" + shop.contactNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-medium mb-2">Payment Methods</h3>
          <div className="flex flex-wrap gap-3">
            {shop.BkashNumber && (
              <div className="bg-white/20 px-3 py-2 rounded-lg flex items-center">
                <span className="font-medium mr-2">bKash:</span>
                <span>{"0" + shop.BkashNumber}</span>
              </div>
            )}
            {shop.NagadNumber && (
              <div className="bg-white/20 px-3 py-2 rounded-lg flex items-center">
                <span className="font-medium mr-2">Nagad:</span>
                <span>{"0" + shop.NagadNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Charge Section Header */}
        <div className="relative mt-6">
          <h3 className="font-medium text-2xl mb-2">Delivery Charges</h3>

          {/* Toggle Button - Beautiful right-aligned version */}
          <button
            onClick={() => setIsCharge(!isCharge)}
            className="absolute right-0 top-0 bg-white/20 hover:bg-white/30 transition-all duration-300 
               rounded-full p-2 shadow-lg flex items-center justify-center
               group" // Added group for hover effects
          >
            {isCharge ? (
              <ChevronDown
                size={24}
                className="text-white transform group-hover:scale-110 transition-transform"
              />
            ) : (
              <ChevronUp
                size={24}
                className="text-white transform group-hover:scale-110 transition-transform"
              />
            )}
            <span className="sr-only">{isCharge ? "Collapse" : "Expand"}</span>
          </button>
        </div>

        {/* Expanded Content */}
        {isCharge && (
          <div className="mt-4 bg-white/10 p-6 rounded-lg backdrop-blur-sm space-y-4">
            <div className="flex flex-col gap-4">
              {shop.localAreas?.length ? (
                shop.localAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-40 font-medium text-white/90">
                      {area}
                    </span>
                    <input
                      type="number"
                      className="px-4 py-2 rounded-lg text-black w-32 focus:ring-2 focus:ring-amber-300"
                      value={charges[index] || ""}
                      onChange={(e) =>
                        handleChargeChange(index, e.target.value)
                      }
                      placeholder="0"
                    />
                    <span className="text-white/70">BDT</span>
                  </div>
                ))
              ) : (
                <p className="text-white/70 italic">
                  No delivery areas configured
                </p>
              )}
            </div>

            <button
              onClick={handleSaveCharges}
              className="mt-6 w-full bg-white hover:bg-amber-50 text-orange-600 font-semibold 
               px-6 py-3 rounded-lg transition-colors duration-300 shadow-md
               flex items-center justify-center gap-2"
            >
              Save Delivery Charges
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailsCard;
