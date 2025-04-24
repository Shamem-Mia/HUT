import {
  Clock,
  Check,
  X,
  Star,
  Plus,
  Minus,
  Store,
  AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FoodItemDetailsCard = () => {
  const { state } = useLocation();
  const initialQuantity = state?.initialQuantity || 0;
  const item = state?.item || {};

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(initialQuantity);

  const shop = item?.shop;

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  if (!item || !shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Item Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center mx-auto"
          >
            <X className="mr-1 transform rotate-180" size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const decreaseQuantity = () => {
    const newQuantity = Math.max(0, quantity - 1);
    setQuantity(newQuantity);
  };

  const deliveryCharge = shop.deliveryCharge?.[0] || 0;
  const totalPrice =
    item.price * quantity + (quantity > 0 ? deliveryCharge : 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-orange-500 hover:text-orange-600 mb-4 transition-colors"
      >
        <X className="mr-1 transform rotate-180" size={18} />
        Back to menu
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Main content grid */}
        <div className="md:flex">
          {/* Image section */}
          <div className="md:w-1/2 lg:w-2/5 bg-gray-50 p-4 flex items-center justify-center">
            <img
              src={item.image}
              alt={item.name}
              className="max-h-80 md:max-h-96 w-full object-contain rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Details section */}
          <div className="p-6 md:w-1/2 lg:w-3/5">
            {/* Shop info */}
            <div className="flex items-center mb-4">
              <div className="p-2 bg-orange-100 rounded-full mr-3">
                <Store className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{shop.shopName}</h2>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                    PIN: {shop.shopPin}
                  </span>
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {shop.shopCategory}
                  </span>
                </div>
              </div>
            </div>

            {/* Item name and price */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
              <span className="text-2xl font-bold text-orange-600">
                ৳{item.price.toFixed(2)}
              </span>
            </div>

            {/* Category and availability */}
            <div className="flex items-center mb-6">
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600 mr-3">
                {item.category}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  item.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Preparation time and rating */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-gray-600">
                <Clock className="mr-1" size={16} />
                <span>{item.preparationTime}</span>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="font-medium text-gray-800">4.5</span>
                <span className="text-gray-500 ml-1">(24 reviews)</span>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 0 || !item.isAvailable}
                  className={`p-2 rounded-full transition-colors ${
                    quantity <= 0 || !item.isAvailable
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-orange-500"
                  }`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-lg font-medium mx-2">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  disabled={!item.isAvailable}
                  className={`p-2 rounded-full transition-colors ${
                    !item.isAvailable
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-orange-500"
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <Store className="text-blue-500 mr-2" size={18} />
                <span className="font-medium text-blue-800">
                  Delivery Information
                </span>
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1">
                  • Delivery charge: ৳{deliveryCharge.toFixed(2)}
                </p>
                <p className="mb-1">
                  • Delivery areas: {shop.localAreas.join(", ")}
                </p>
                <p>• Delivery time: 30-45 minutes</p>
              </div>
            </div>

            {/* Total price */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="text-xl font-bold text-orange-600">
                  ৳{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional shop info at bottom */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Shop Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Store className="text-gray-500 mr-3 mt-0.5" size={16} />
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">0{shop.contactNumber}</p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="text-gray-500 mr-3 mt-0.5" size={16} />
              <div>
                <p className="text-sm text-gray-500">Additional Info</p>
                <p className="font-medium">{shop.additionalInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FoodItemDetailsCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    preparationTime: PropTypes.string.isRequired,
    isAvailable: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired,
    shop: PropTypes.shape({
      shopName: PropTypes.string.isRequired,
      shopPin: PropTypes.number.isRequired,
      shopCategory: PropTypes.string.isRequired,
      deliveryCharge: PropTypes.arrayOf(PropTypes.number),
      localAreas: PropTypes.arrayOf(PropTypes.string).isRequired,
      BkashNumber: PropTypes.string.isRequired,
      NagadNumber: PropTypes.string.isRequired,
      contactNumber: PropTypes.string.isRequired,
      additionalInfo: PropTypes.string.isRequired,
    }).isRequired,
  }),
  initialQuantity: PropTypes.number,
};

export default FoodItemDetailsCard;
