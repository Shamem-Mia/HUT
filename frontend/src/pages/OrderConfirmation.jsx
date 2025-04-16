// order-confirmation.js
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderDetails, message } = state || {};

  if (!orderDetails) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">No order details found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        {orderDetails.status === "pending" ? (
          <>
            <Clock size={48} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">
              Order Pending for Approval
            </h2>
            <p className="text-gray-600 mb-6">
              {message ||
                "Your order is awaiting approval from the shop owner."}
            </p>
          </>
        ) : orderDetails.status === "approved" ? (
          <>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Order Approved!
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been approved and will be delivered soon.
            </p>
            {orderDetails.deliveryPin && (
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="font-medium">Your Delivery PIN:</p>
                <p className="text-3xl font-bold text-gray-800">
                  {orderDetails.deliveryPin}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Share this PIN with the delivery person for verification
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Order Rejected
            </h2>
            <p className="text-gray-600 mb-6">
              The shop owner has declined your order. Your payment will be
              refunded.
            </p>
          </>
        )}

        <div className="border-t pt-6">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <p className="text-gray-600">Order ID: {orderDetails._id}</p>
          <p className="text-gray-600">
            Total Amount: ৳{orderDetails.payment?.amount?.toFixed(2)}
          </p>
        </div>

        <div className="w-full bg-orange-100 rounded-md text-orange-900 text-lg p-2">
          <h2 className="mb-3">
            You will get a PIN just after approved the order by the shop
            owner.Share this PIN with the delivery person for verification
          </h2>
        </div>

        <div className="flex justify-around gap-4">
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/user-delivery-history")}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            See Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
