import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Loader2, ShoppingCart } from "lucide-react";

const FoodMenu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/food-items/available");
      setFoodItems(data);
    } catch (error) {
      toast.error("Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", "appetizer", "main course", "dessert", "beverage"];
  const filteredItems =
    selectedCategory === "all"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Food Menu</h1>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">
            No food items available in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.shop.shopName} • {item.shop.localArea}
                    </p>
                  </div>
                  <span className="font-bold text-blue-600">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.preparationTime} mins
                  </span>
                  <button className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    <ShoppingCart className="mr-1" size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
