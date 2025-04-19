import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";
import { getGuestKey } from "../context/guestUser.js";

const PaymentPage = () => {
  const { authUser } = useAuthStore();
  const userGuestKey = getGuestKey();

  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderedItems, deliveryDetails } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("nagad");
  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [shopDetails, setShopDetails] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // Fetch shop details when component mounts
  useEffect(() => {
    if (orderedItems?.length > 0) {
      const fetchShopDetails = async () => {
        try {
          setLoadingShop(true);
          const shopId = orderedItems[0].shop?._id || orderedItems[0].shop;

          const response = await axiosInstance.get(`/shops/item/${shopId}`);
          setShopDetails(response.data);

          // Calculate delivery charge if delivery location matches shop's local area
          if (
            deliveryDetails?.universityOrVillage &&
            response.data?.localAreas
          ) {
            const areaIndex = response.data.localAreas.findIndex(
              (area) =>
                area.toLowerCase() ===
                deliveryDetails.universityOrVillage.toLowerCase()
            );

            if (
              areaIndex !== -1 &&
              response.data.deliveryCharge?.[areaIndex] !== undefined
            ) {
              setDeliveryCharge(response.data.deliveryCharge[areaIndex]);
            }
          }
        } catch (error) {
          console.error("Error fetching shop details:", error);
          toast.error(
            error.response?.data?.message || "Failed to load shop information"
          );
        } finally {
          setLoadingShop(false);
        }
      };

      fetchShopDetails();
    }
  }, [orderedItems, deliveryDetails]);

  // Calculate total price including delivery charge
  const subtotalPrice =
    orderedItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
    0;

  const totalPrice = subtotalPrice + deliveryCharge;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!mobileNumber || !transactionId) {
      toast.error("Please provide mobile number and transaction ID");
      return;
    }

    if (!authUser && !userGuestKey) {
      return navigate("/login");
    }

    try {
      const deliveryData = {
        items: orderedItems,
        deliveryDetails,
        payment: {
          method: paymentMethod,
          amount: totalPrice,
          paymentNumber: mobileNumber,
          transactionId,
        },
        shop: orderedItems[0].shop,
        status: "pending",
        deliveryCharge: deliveryCharge,
        selfDelivery: shopDetails.selfDelivery,
      };

      if (!authUser && userGuestKey) {
        deliveryData.guestKey = userGuestKey;
      }

      // Save delivery to database
      const response = await axiosInstance.post("/deliveries", deliveryData);

      // Navigate to confirmation with delivery data
      navigate("/order-confirmation", {
        state: {
          orderDetails: response.data,
          message:
            "Your order has been submitted for approval. The shop owner will review it shortly.",
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process order");
    }
  };

  if (!orderedItems || orderedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">No order items found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 flex items-center justify-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Summary Card */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-orange-600 px-6 py-4">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="mr-4 flex items-center text-white hover:text-orange-200"
                  >
                    <ArrowLeft size={18} className="mr-1" />
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                    Confirm Your Order
                  </h1>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Delivery Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center text-gray-800">
                    <MapPin size={20} className="mr-2 text-orange-500" />
                    Delivery Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        university / Village
                      </p>
                      <p>
                        {deliveryDetails?.universityOrVillage || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Hall/Moholla
                      </p>
                      <p>{deliveryDetails?.hallOrMoholla || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Room/Identity
                      </p>
                      <p>{deliveryDetails?.roomOrIdentity || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Delivery Time
                      </p>
                      <p className="flex items-center">
                        <Calendar size={16} className="mr-1 text-gray-500" />
                        {deliveryDetails?.deliveryDate || "Not specified"},{" "}
                        <Clock size={16} className="ml-2 mr-1 text-gray-500" />
                        {deliveryDetails?.deliveryTime || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Order
                  </h2>

                  <div className="divide-y">
                    {orderedItems.map((item) => (
                      <div
                        key={item._id}
                        className="py-4 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-medium">
                              {item.quantity}x
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ৳{item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-700">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>৳{subtotalPrice.toFixed(2)}</span>
                    </div>
                    {deliveryCharge > 0 && (
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery Charge</span>
                        <span>৳{deliveryCharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg text-gray-800 pt-2 border-t">
                      <span>Total Amount</span>
                      <span>৳{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              {/* Header */}
              <div className="bg-orange-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Complete Payment
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Shop Info */}
                {shopDetails && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Store size={18} className="text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {shopDetails.shopName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {shopDetails.shopCategory}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["bkash", "nagad"].map((method) => (
                        <div key={method}>
                          <input
                            type="radio"
                            id={method}
                            name="paymentMethod"
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="hidden peer"
                          />
                          <label
                            htmlFor={method}
                            className={`block p-3 border rounded-lg cursor-pointer text-center capitalize font-medium ${
                              paymentMethod === method
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-300 hover:border-orange-300"
                            }`}
                          >
                            {method}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Merchant Info */}
                  {shopDetails && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        To confirm your order,send {totalPrice.toFixed(2)} taka
                        to:
                      </p>
                      <p className="text-xl font-bold text-blue-900">
                        {paymentMethod === "bkash"
                          ? "0" + shopDetails.BkashNumber
                          : "0" + shopDetails.NagadNumber}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {shopDetails.shopName}'s {paymentMethod} account
                      </p>
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your {paymentMethod} Number
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-lg border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="transactionId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        id="transactionId"
                        required
                        placeholder="Enter transaction ID"
                        className="w-full rounded-lg border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h3 className="text-sm font-semibold text-orange-800 mb-2">
                      Payment Instructions:
                    </h3>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block mr-2">1.</span>
                        Dial *247# for bKash or *167# for Nagad
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block mr-2">2.</span>
                        Select "Send Money" and enter merchant number
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block mr-2">3.</span>
                        Enter amount:{" "}
                        <span className="font-bold ml-1">
                          ৳{totalPrice.toFixed(2)}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block mr-2">4.</span>
                        <div className=" text-lg">
                          Use <span className="font-bold mx-1">HUT ORDER</span>{" "}
                          as
                          <span className="font-bold mx-1">Reference</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <CheckCircle size={20} className="mr-2" />
                    Confirm & Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
