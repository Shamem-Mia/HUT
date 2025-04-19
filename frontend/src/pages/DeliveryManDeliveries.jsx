import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import {
  MapPin,
  Clock,
  CheckCircle,
  User,
  Package,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

const DeliveryManDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pin, setPin] = useState("");
  const [activeDelivery, setActiveDelivery] = useState(null);
  const { authUser } = useAuthStore();

  const fetchDeliveries = async () => {
    try {
      const response = await axiosInstance.get(
        `/delivery-man/${authUser._id}`,
        {
          params: { search: searchTerm },
        }
      );

      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      toast.error("Failed to fetch deliveries");
      console.error(error);
    } finally {
      setLoading(false);
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

      await axiosInstance.put(`/deliveries/${deliveryId}/verify`, {
        pin,
        shopId: deliveryToVerify.shop?._id,
      });
      fetchDeliveries();
      setPin("");
      setActiveDelivery(null);
      toast.success("Delivery verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    if (authUser?._id) {
      fetchDeliveries();
    }
  }, [authUser, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        My Assigned Deliveries
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search deliveries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-orange-50 rounded-xl p-8 text-center">
          <p className="text-orange-700 text-lg">
            {searchTerm
              ? "No matching deliveries found"
              : "No deliveries assigned to you"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-white mr-2" />
                    <h2 className="text-lg font-semibold text-white">
                      {delivery.user?.name || "Customer"}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    APPROVED
                  </span>
                </div>
                <p className="text-orange-100 text-sm mt-1">
                  Order #: {delivery._id.substring(18, 24).toUpperCase()}
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-orange-500 mt-1 mr-2" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Delivery Address
                        </h3>
                        <div className="mt-1 text-sm text-gray-600">
                          <p>{delivery.deliveryDetails?.universityOrVillage}</p>
                          <p>{delivery.deliveryDetails?.hallOrMoholla}</p>
                          <p>
                            Room: {delivery.deliveryDetails?.roomOrIdentity}
                          </p>
                          <p>
                            Contact: {delivery.deliveryDetails?.contactNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-orange-500 mt-1 mr-2" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Delivery Time
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {new Date(
                            delivery.deliveryDetails?.deliveryDate
                          ).toLocaleDateString()}
                          <br />
                          {delivery.deliveryDetails?.deliveryTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      Order Summary
                    </h3>
                    <ul className="space-y-3">
                      {delivery.items?.map((item, index) => (
                        <li key={index} className="flex justify-between">
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
                              <p className="text-xs text-amber-600">
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

                {/* Updated Verification Section */}
                {delivery.status === "approved" && (
                  <div className="mt-6 px-4 pb-4 text-center">
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
                      <p className="text-xs text-orange-600 mt-2">
                        PIN provided to customer: {delivery.deliveryPin}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryManDeliveries;
