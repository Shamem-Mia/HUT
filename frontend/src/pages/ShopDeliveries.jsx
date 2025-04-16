import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { MapPin, Clock, CheckCircle, User } from "lucide-react";
import toast from "react-hot-toast";
import DeliverySearchByPin from "../components/DeliverySearchByPin";

const ShopDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [highlightedDelivery, setHighlightedDelivery] = useState(null);

  const verifyDelivery = async (deliveryId) => {
    if (!pin || pin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      await axiosInstance.put(`/deliveries/${deliveryId}/verify`, { pin });
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

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axiosInstance.get("/deliveries/shop");
        const fetchedDeliveries = Array.isArray(response.data)
          ? response.data
          : [];

        const sortedDeliveries = fetchedDeliveries.sort((a, b) => {
          if (a.status === "delivered" && b.status !== "delivered") return 1;
          if (a.status !== "delivered" && b.status === "delivered") return -1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setDeliveries(sortedDeliveries);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">
        Your Shop Deliveries
      </h1>

      {/* Add the search component at the top */}
      <DeliverySearchByPin
        onSearchComplete={(delivery) => setHighlightedDelivery(delivery._id)}
      />

      {deliveries.length === 0 ? (
        <div className="bg-orange-50 rounded-xl p-8 text-center">
          <p className="text-orange-700 text-lg">No deliveries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border ${
                delivery._id === highlightedDelivery
                  ? "border-2 border-blue-500"
                  : delivery.status === "delivered"
                  ? "border-green-100"
                  : "border-orange-100"
              } hover:shadow-xl transition-all mb-6`}
            >
              {/* Card Header */}
              <div
                className={`bg-gradient-to-r px-6 py-4 ${
                  delivery.status === "delivered"
                    ? "from-green-500 to-emerald-500"
                    : "from-orange-500 to-amber-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User size={20} className="text-white mr-2" />
                    <h2 className="text-lg font-semibold text-white">
                      {delivery.user?.name || "Customer"}
                    </h2>
                  </div>

                  {/* Timer moved here, outside the status badge */}
                  {delivery.status === "delivered" && (
                    <div className="text-xs text-white bg-black bg-opacity-20 px-2 py-1 rounded">
                      Auto-deletes in: {calculateTimeLeft(delivery.verifiedAt)}
                    </div>
                  )}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      delivery.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : delivery.status === "approved"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {delivery.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-orange-100 text-sm mt-1">
                  Ordered on {new Date(delivery.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Rest of your card content remains exactly the same */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Delivery Info */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-orange-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Delivery Address
                      </h3>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>{delivery.deliveryDetails?.location}</p>
                        <p>{delivery.deliveryDetails?.hallOrMoholla}</p>
                        <p>{delivery.deliveryDetails?.roomOrIdentity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock size={18} className="text-orange-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Delivery Time
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {delivery.deliveryDetails?.deliveryDate &&
                          new Date(
                            delivery.deliveryDetails.deliveryDate
                          ).toLocaleDateString()}
                        <br />
                        {delivery.deliveryDetails?.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Items */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Order Summary
                  </h3>
                  <ul className="space-y-2">
                    {delivery.items?.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-orange-100"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.quantity}x {item.name}
                            </p>
                            <p className="text-sm text-amber-600">
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-orange-100 font-bold flex justify-between text-orange-600">
                    <span>Total</span>
                    <span>৳{delivery.payment?.amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Verification Section - Bottom Center */}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDeliveries;
