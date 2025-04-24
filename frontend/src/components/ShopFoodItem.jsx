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
import { useNavigate } from "react-router-dom";

const ShopFoodItem = ({ item, onSelect, initialQuantity = 0 }) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const navigate = useNavigate();
  const shop = item.shop;

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onSelect({ ...item, quantity: newQuantity });
  };

  const decreaseQuantity = () => {
    const newQuantity = Math.max(0, quantity - 1);
    setQuantity(newQuantity);
    onSelect({ ...item, quantity: newQuantity });
  };

  const handleSeeDetails = () => {
    navigate(`/food-item-details/${item._id}`, {
      state: { initialQuantity: quantity, item: item },
    });
  };

  if (!shop.isOpen) {
    return (
      <div className="border border-red-200 rounded-lg bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-semibold">Shop Closed</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-gray-800 line-clamp-1">
              {shop.shopName}
            </p>
            <p className="text-xs text-gray-500">PIN: {shop.shopPin}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-red-600">
          This shop is currently closed. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      {/* Food Image */}
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden p-2">
        <img
          src={item.image}
          alt={item.name}
          className="max-h-full max-w-full object-contain rounded-lg"
          loading="lazy"
        />
      </div>
      {/* shop info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3 p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
          {/* Shop Name */}
          <div className="flex items-center min-w-0">
            <div className="p-1.5 mr-2 bg-orange-100 rounded-full">
              <Store className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
              {shop.shopName}
            </h3>
          </div>

          {/* Shop PIN */}
          <div className="flex-shrink-0 ml-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
              PIN: {shop.shopPin}
            </span>
          </div>
        </div>
        {/* Food Info */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-1">
            {item.name}
          </h3>
          <span className="font-bold text-orange-600 whitespace-nowrap">
            ৳{item.price.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="px-1.5 py-0.5 rounded-full text-[15px] font-medium bg-blue-200 text-blue-500 shadow-md">
            {item.category}
          </span>
          <button
            onClick={handleSeeDetails}
            className="text-sm text-blue-600 hover:underline font-medium ml-4"
          >
            See Details
          </button>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="flex justify-between items-center text-xs mb-3">
          <span className="flex items-center text-gray-500">
            <Clock size={12} className="mr-1" />
            {item.preparationTime}
          </span>

          <div className="flex items-center">
            <span className="flex items-center mr-2">
              <Star size={12} className="text-yellow-400 mr-0.5" />
              <span className="text-gray-700 font-medium">4.5</span>
            </span>

            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                item.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.isAvailable ? "Available" : "Sold Out"}
            </span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 0 || !item.isAvailable}
              className={`p-1 rounded-full transition-colors ${
                quantity <= 0 || !item.isAvailable
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button
              onClick={increaseQuantity}
              disabled={!item.isAvailable}
              className={`p-1 rounded-full transition-colors ${
                !item.isAvailable
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Add to Order Button */}
        <button
          onClick={increaseQuantity}
          disabled={!item.isAvailable}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
            item.isAvailable
              ? quantity > 0
                ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {item.isAvailable
            ? quantity > 0
              ? `Added (৳${(item.price * quantity).toFixed(2)})`
              : "Click to Order"
            : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

ShopFoodItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    preparationTime: PropTypes.number.isRequired,
    isAvailable: PropTypes.bool.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  initialQuantity: PropTypes.number,
};

export default ShopFoodItem;
