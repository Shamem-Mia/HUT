import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, Outlet } from "react-router-dom";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { ArrowLeft, Utensils, MapPin, Star, ShoppingCart } from "lucide-react";
import ShopFoodItem from "../components/ShopFoodItem";
import Footer from "../components/Footer";

const ShopFoodItemsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shopRes, itemsRes] = await Promise.all([
          axiosInstance.get(`/shops/${id}`),
          axiosInstance.get(`/food-items/shop/${id}`),
        ]);

        setShop(shopRes.data);
        setFoodItems(itemsRes.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load shop details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleItemSelection = (itemWithQuantity) => {
    setSelectedItems((prevItems) => {
      // Remove if quantity is 0
      if (itemWithQuantity.quantity === 0) {
        return prevItems.filter((item) => item._id !== itemWithQuantity._id);
      }

      // Update or add the item
      const existingIndex = prevItems.findIndex(
        (item) => item._id === itemWithQuantity._id
      );
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex] = itemWithQuantity;
        return updated;
      }
      return [...prevItems, itemWithQuantity];
    });
  };

  const proceedToCheckout = () => {
    const validItems = selectedItems.filter((item) => item.quantity > 0);
    if (validItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }
    navigate("/order", { state: { shop, orderedItems: validItems } });
  };

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Books",
    "Components",
    "other",
  ];

  const filteredItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Shop not found</p>
        <Link
          to="/user-menu"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to shops
        </Link>
      </div>
    );
  }

  const totalSelected = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Shop Header */}
      <div className="mb-8">
        <Link
          to="/user-menu"
          className="flex items-center text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to all shops
        </Link>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img
              src={shop.image || "https://via.placeholder.com/100"}
              alt={shop.shopName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {shop.shopName}
            </h1>
            <div className="flex items-center mt-1 text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span className="text-sm">{shop.localArea}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center text-sm">
                <Star size={14} className="text-yellow-400 mr-1" />
                4.5 (120+ ratings)
              </span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shop.isOpen
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {shop.isOpen ? "Open Now" : "Currently Closed"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Food Items Section */}
      <div className="mb-20">
        <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Utensils size={18} className="mr-2 text-orange-500" />
          Menu
        </h2>

        {/* Category buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">
              No food items available in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ShopFoodItem
                key={item._id}
                item={{ ...item, shop }} // Pass the shop data with each item
                onSelect={handleItemSelection}
                initialQuantity={
                  selectedItems.find((selected) => selected._id === item._id)
                    ?.quantity || 0
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Checkout Button */}
      {totalSelected > 0 && (
        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={proceedToCheckout}
            className="flex items-center px-6 py-3 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            <ShoppingCart size={18} className="mr-2" />
            Checkout ({totalSelected})
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ShopFoodItemsPage;
