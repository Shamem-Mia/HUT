import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { MapPin, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { getGuestKey } from "../context/guestUser.js";
import { useAuthStore } from "../stores/useAuthStore";

const UserDeliveryHistory = () => {
  const { authUser } = useAuthStore();
  const userGuestKey = getGuestKey();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!authUser && !userGuestKey) {
        return navigate("/guest-entry");
      }
      try {
        const config = {
          params: {},
        };

        if (!authUser && userGuestKey) {
          config.params.guestKey = userGuestKey;
        }
        const response = await axiosInstance.get("/deliveries/user", config);
        const sortedDeliveries = Array.isArray(response.data?.deliveries)
          ? response.data.deliveries.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
          : [];

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
    if (!verifiedAt) return "0d 0h 0m";

    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const timePassed = Date.now() - new Date(verifiedAt).getTime();
    const timeLeft = SEVEN_DAYS - timePassed;

    if (timeLeft <= 0) return "0d 0h 0m"; // Already expired

    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
  };
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        Your Delivery History
      </h1>

      {deliveries.length === 0 ? (
        <p className="text-gray-500">No deliveries found</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Shop Header - Updated color based on status */}
              <div
                className={`px-6 py-4 border-b ${
                  delivery.status === "delivered"
                    ? "bg-green-500 border-green-700"
                    : "bg-gradient-to-r from-orange-200 to-amber-200 border-orange-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {delivery.shop?.shopName}
                    </h2>
                    <p
                      className={`text-sm mt-1 ${
                        delivery.status === "delivered"
                          ? "text-green-100"
                          : "text-amber-800"
                      }`}
                    >
                      Ordered:{" "}
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Timer */}
                  {delivery.status === "delivered" && (
                    <div className="text-xs text-white bg-black bg-opacity-20 px-2 py-1 rounded">
                      Auto-deletes in: {calculateTimeLeft(delivery.verifiedAt)}
                    </div>
                  )}

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      delivery.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : delivery.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : delivery.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </div>
              </div>

              {/* Rest of the card remains exactly the same */}
              <div className="px-6 py-4 bg-white">
                <h3 className="font-medium text-lg text-orange-700 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-orange-500" />
                  Order Summary
                </h3>
                <ul className="mt-3 divide-y divide-orange-50">
                  {delivery.items?.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
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
                      <span className="font-medium text-orange-600">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-b border-orange-100">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <h3 className="font-medium text-orange-700 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                      Delivery Details
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
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
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <h3 className="font-medium text-orange-700 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      Delivery Time
                    </h3>
                    <p className="mt-2 text-sm text-gray-700">
                      {delivery.deliveryDetails?.deliveryDate &&
                        new Date(
                          delivery.deliveryDetails.deliveryDate
                        ).toLocaleDateString()}{" "}
                      at {delivery.deliveryDetails?.deliveryTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-lg font-bold text-orange-600">
                    Total: ৳{delivery.payment?.amount?.toFixed(2)}
                  </div>

                  {delivery.deliveryPin ? (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <h3 className="font-medium text-orange-700 text-sm mb-1">
                        Your Delivery PIN
                      </h3>
                      <div className="bg-white p-2 rounded inline-block">
                        <span className="text-2xl font-mono font-bold text-orange-600">
                          {delivery.deliveryPin}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-amber-600">
                        Share this PIN with the delivery person
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-amber-600 italic">
                      Delivery PIN will be visible when approved
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDeliveryHistory;
