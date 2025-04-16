import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Loader2, X, MapPin, ShoppingCart } from "lucide-react";
import ShopFoodItem from "./ShopFoodItem";

// Helper functions for localStorage
const getLocalStorageArea = () => {
  return typeof window !== "undefined"
    ? localStorage.getItem("userLocalArea") || ""
    : "";
};

const setLocalStorageArea = (area) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userLocalArea", area);
  }
};

const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Books",
  "Components",
  "Other",
];

const FoodItemSearchForHome = () => {
  const navigate = useNavigate();
  const [localArea, setLocalArea] = useState(getLocalStorageArea());
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Memoized search function
  const searchFoodItems = useCallback(async (area) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/food-items/search?area=${encodeURIComponent(area)}`,
        { signal: abortControllerRef.current.signal }
      );

      setFoodItems(response.data?.foodItems || []);

      if (!response.data?.foodItems?.length) {
        toast.success(`No items found in ${area}`, { icon: "ℹ️" });
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Search error:", err);
        setError(err.message);
        // toast.error(err.response?.data?.message || "Search failed");
        setFoodItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const trimmedArea = localArea.trim();

    if (trimmedArea.length >= 2) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        searchFoodItems(trimmedArea);
      }, 500);
    } else {
      setFoodItems([]);
    }

    return () => {
      clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [localArea, searchFoodItems]);

  // Update localStorage when localArea changes
  useEffect(() => {
    setLocalStorageArea(localArea);
  }, [localArea]);

  const handleItemSelection = useCallback((selectedItem) => {
    setSelectedItems((prevItems) => {
      if (selectedItem.quantity === 0) {
        return prevItems.filter((item) => item._id !== selectedItem._id);
      }

      const existingIndex = prevItems.findIndex(
        (item) => item._id === selectedItem._id
      );

      if (existingIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = selectedItem;
        return updatedItems;
      }
      return [...prevItems, selectedItem];
    });
  }, []);

  const proceedToCheckout = useCallback(() => {
    const validItems = selectedItems.filter((item) => item.quantity > 0);

    if (validItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    // Get the shop from the first selected item
    const firstItemShop = validItems[0]?.shop;

    if (!firstItemShop) {
      toast.error("Shop information is missing");
      return;
    }

    // Verify all items belong to the same shop
    const allSameShop = validItems.every(
      (item) => item.shop?._id === firstItemShop._id
    );

    if (!allSameShop) {
      toast.error("Please select items from only one shop at a time");
      return;
    }

    navigate("/order", {
      state: {
        shop: firstItemShop,
        orderedItems: validItems,
        fromSearch: true,
      },
    });
  }, [selectedItems, navigate]);

  const handleInputChange = (e) => {
    setLocalArea(e.target.value);
  };

  const clearSearch = () => {
    setLocalArea("");
    setFoodItems([]);
  };

  // Calculate totals
  const { totalSelected, totalPrice } = selectedItems.reduce(
    (acc, item) => {
      acc.totalSelected += item.quantity;
      acc.totalPrice += item.price * item.quantity;
      return acc;
    },
    { totalSelected: 0, totalPrice: 0 }
  );

  const filteredItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="container mx-auto p-4 max-w-6xl relative pb-20">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Find Food Items in Your Area / University
      </h1>

      {/* Search Input */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative flex items-center bg-white rounded-lg shadow-sm border border-gray-300 mt-2">
          <div className="pl-3 text-gray-500">
            <MapPin size={20} />
          </div>
          <input
            type="text"
            value={localArea}
            onChange={handleInputChange}
            placeholder="Enter your local area (e.g. CUET Campus)"
            className="flex-1 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
            aria-label="Search food items by area"
          />
          {localArea && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          {loading && (
            <div className="pr-3">
              <Loader2 className="animate-spin h-5 w-5 text-orange-500" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2 pl-1">
          {localArea.length > 0 && localArea.length < 2
            ? "Type at least 2 characters"
            : foodItems.length > 0
            ? `${foodItems.length} ${
                foodItems.length === 1 ? "item" : "items"
              } found in ${localArea}`
            : localArea.length >= 2
            ? "No items found in this area"
            : "Results will appear as you type"}
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Section */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <ShopFoodItem
              key={item._id}
              item={item}
              onSelect={handleItemSelection}
              initialQuantity={
                selectedItems.find((selected) => selected._id === item._id)
                  ?.quantity || 0
              }
            />
          ))}
        </div>
      ) : (
        localArea.length >= 2 &&
        !loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">No food items found in this area</p>
          </div>
        )
      )}

      {/* Checkout Button */}
      {totalSelected > 0 && (
        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={proceedToCheckout}
            className="flex items-center px-6 py-3 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            <ShoppingCart size={18} className="mr-2" />
            Checkout ({totalSelected}) • ৳{totalPrice.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodItemSearchForHome;
