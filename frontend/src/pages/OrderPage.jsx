import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const OrderPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderedItems = state?.orderedItems || [];
  const shop = state?.shop || null;

  // console.log("shop", shop);
  // console.log("orderedItems.shop:", orderedItems[0].shop);

  const [deliveryDetails, setDeliveryDetails] = useState({
    universityOrVillage: "",
    hallOrMoholla: "",
    roomOrIdentity: "",
    contactNumber: "",
    deliveryDate: "",
    deliveryTime: "",
  });

  // Calculate totals
  const totalQuantity = orderedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = orderedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderedItems.length === 0) {
      toast.error("Please select items to order");
      return;
    }

    navigate("/payment", {
      state: {
        orderedItems,
        deliveryDetails,
        totalPrice,
      },
    });
  };

  if (!shop || orderedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">
          {!shop ? "Shop information missing" : "No items selected for order"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center justify-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft size={18} className="mr-1" />
        </button>
        <h1 className="text-2xl font-bold">Order Summary</h1>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Selection</h2>

        <div className="divide-y">
          {orderedItems.map((item) => (
            <div
              key={item._id}
              className="py-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ৳{item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-medium">
                ৳{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Price:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>

        <div className="space-y-4">
          {/* University/Village */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University/Village/Local Area
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <select
                required
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={deliveryDetails.universityOrVillage}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    universityOrVillage: e.target.value,
                  })
                }
              >
                <option value="">Select an area...</option>
                {shop?.localAreas?.length > 0 ? (
                  shop.localAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))
                ) : (
                  <option disabled>No local areas available</option>
                )}
              </select>
            </div>
          </div>

          {/* Hall/Moholla */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hall/Moholla
            </label>
            <input
              type="text"
              required
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Bangabandhu Hall(BB) or Moholla-1"
              value={deliveryDetails.hallOrMoholla}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  hallOrMoholla: e.target.value,
                })
              }
            />
          </div>

          {/* Room/Identity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number/Any Known Identity
            </label>
            <input
              type="text"
              required
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. B-507 or Near Central Mosque"
              value={deliveryDetails.roomOrIdentity}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  roomOrIdentity: e.target.value,
                })
              }
            />
          </div>
          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Contact Number
            </label>
            <input
              type="tel"
              required
              pattern="01[3-9]\d{8}"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="+8801***"
              value={deliveryDetails.contactNumber}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  contactNumber: e.target.value,
                })
              }
            />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                required
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={deliveryDetails.deliveryDate}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    deliveryDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <input
                type="time"
                required
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={deliveryDetails.deliveryTime}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    deliveryTime: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
