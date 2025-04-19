// components/ShopPendingDeliveries.js
import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Package,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

const ShopPendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingDeliveries = async () => {
    try {
      const response = await axiosInstance.get("/deliveries/pending");
      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Failed to fetch pending deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveDelivery = async (deliveryId) => {
    try {
      const response = await axiosInstance.put(
        `/deliveries/${deliveryId}/approve`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchPendingDeliveries();
      toast.success("Delivery approved successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve delivery"
      );
    }
  };

  const rejectDelivery = async (deliveryId) => {
    try {
      await axiosInstance.delete(`/deliveries/${deliveryId}/reject`);
      fetchPendingDeliveries();
      alert("Delivery rejected successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject delivery");
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        Pending Delivery Requests
      </h1>

      {deliveries.length === 0 ? (
        <p className="text-gray-500">No pending deliveries found</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Customer Header */}
              <div className="bg-gradient-to-r from-orange-100 to-amber-200 px-6 py-4 border-b border-orange-600">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-orange-600 mr-2" />
                    <h2 className="text-lg font-semibold text-orange-700">
                      {delivery.user?.name || "Customer"}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                    Pending Approval
                  </span>
                </div>
                <p className="text-orange-800 text-sm mt-1">
                  Order placed:{" "}
                  {new Date(delivery.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 bg-white">
                <h3 className="font-medium text-lg text-orange-700 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-orange-500" />
                  Order Items
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

              {/* Payment Information */}
              <div className="px-6 py-4 bg-white border-t border-orange-100">
                <h3 className="font-medium text-orange-700 text-lg flex items-center mb-3">
                  <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
                  Payment Details
                </h3>

                {delivery.payment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Payment Method */}
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <p className="text-sm font-medium text-amber-700">
                        Payment Method
                      </p>
                      <p className="text-gray-800 capitalize">
                        {delivery.payment.method || "Cash on Delivery"}
                      </p>
                    </div>

                    {/* Payment Number - only show if online payment */}
                    {delivery.payment.method !== "cash" && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <p className="text-sm font-medium text-amber-700">
                          {delivery.payment.method === "nagad"
                            ? "Nagad"
                            : delivery.payment.method === "bkash"
                            ? "Bkash"
                            : "Payment"}{" "}
                          Number
                        </p>
                        <p className="text-gray-800">
                          {delivery.payment.paymentNumber
                            ? `0${delivery.payment.paymentNumber}`
                            : "N/A"}
                        </p>
                      </div>
                    )}

                    {/* Transaction ID */}
                    {delivery.payment.transactionId && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 md:col-span-2">
                        <p className="text-sm font-medium text-amber-700">
                          Transaction ID
                        </p>
                        <p className="text-gray-800 font-mono break-all">
                          {delivery.payment.transactionId}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No payment information available
                  </p>
                )}
              </div>

              {/* Delivery Information */}
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-b border-orange-100">
                <div className="grid grid-cols-1 gap-4">
                  {/* Delivery Address */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <h3 className="font-medium text-orange-700 text-lg flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                      Delivery Address
                    </h3>
                    <div className="mt-2 space-y-1 text-gray-700">
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

                  {/* Delivery Time */}
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

              {/* Total and Actions */}
              <div className="px-6 py-4 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-lg font-bold text-orange-600">
                    Total: ৳{delivery.payment?.amount?.toFixed(2)}
                  </div>
                  <div className="flex space-x-3">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPendingDeliveries;
