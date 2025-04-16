import { Store, MapPin, Utensils, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ShopCard = ({ shop }) => {
  // validation
  if (!shop?._id || typeof shop._id !== "string") {
    console.error("Invalid shop data:", shop);
    return (
      <div className="border rounded-lg p-4 bg-red-50 text-red-600">
        Invalid shop data
      </div>
    );
  }

  const handleShopClick = (e) => {
    if (shop.isOpen === false) {
      e.preventDefault();
      toast.error("This shop is currently closed. Please try again later.");
    }
  };

  const colorVariants = {
    "Food Delivery":
      "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
    Confectionary:
      "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    "Book Store": "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
    Electronics:
      "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
    Clothing:
      "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
    Pharmacy: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    Supermarket:
      "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    Others: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
  };

  const cardStyle = colorVariants[shop.shopCategory] || colorVariants.Others;

  return (
    <Link
      to={shop.isOpen !== false ? `/shop/${shop._id}/food-items` : "#"}
      onClick={handleShopClick}
      className={`block hover:scale-[1.02] transition-transform duration-200 ${
        shop.isOpen === false ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <div
        className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${cardStyle} ${
          shop.isOpen === false ? "border-red-200" : ""
        }`}
      >
        {shop.isOpen === false && (
          <div className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 text-center">
            Currently Closed
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${
                  shop.shopCategory === "Food Delivery"
                    ? "bg-orange-100 text-orange-600"
                    : shop.shopCategory === "Confectionary"
                    ? "bg-green-100 text-green-600"
                    : shop.shopCategory === "Book Store"
                    ? "bg-red-100 text-red-600"
                    : shop.shopCategory === "Electronics"
                    ? "bg-amber-100 text-amber-600"
                    : shop.shopCategory === "Clothing"
                    ? "bg-yellow-100 text-yellow-600"
                    : shop.shopCategory === "Pharmacy"
                    ? "bg-blue-100 text-blue-600"
                    : shop.shopCategory === "Supermarket"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Store size={18} />
              </div>
              <h3 className="font-semibold text-lg ml-3 text-gray-800">
                {shop.shopName}
              </h3>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start">
              <MapPin
                className="flex-shrink-0 text-gray-500 mr-2 mt-0.5"
                size={16}
              />
              <span>
                {shop.localAreas?.join(", ") || "No location specified"}
              </span>
            </div>
            <div className="flex items-center">
              <Utensils
                className="flex-shrink-0 text-gray-500 mr-2"
                size={16}
              />
              <span className="capitalize font-medium">
                {shop.shopCategory}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 border-opacity-50">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                shop.shopCategory === "Food Delivery"
                  ? "bg-orange-200 text-orange-800"
                  : shop.shopCategory === "Confectionary"
                  ? "bg-green-200 text-green-800"
                  : shop.shopCategory === "Book Store"
                  ? "bg-red-200 text-red-800"
                  : shop.shopCategory === "Electronics"
                  ? "bg-amber-200 text-amber-800"
                  : shop.shopCategory === "Clothing"
                  ? "bg-yellow-200 text-yellow-800"
                  : shop.shopCategory === "Pharmacy"
                  ? "bg-blue-200 text-blue-800"
                  : shop.shopCategory === "Supermarket"
                  ? "bg-purple-200 text-purple-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              PIN: {shop.shopPin}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

ShopCard.propTypes = {
  shop: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    shopName: PropTypes.string.isRequired,
    localAreas: PropTypes.arrayOf(PropTypes.string),
    shopCategory: PropTypes.string.isRequired,
    shopPin: PropTypes.number.isRequired,
    image: PropTypes.string,
    isOpen: PropTypes.bool,
  }).isRequired,
};

export default ShopCard;
