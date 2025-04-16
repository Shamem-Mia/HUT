import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import FoodItemForm from "../components/FoodItemForm";
import ShopDetailsCard from "../components/ShopDetailsCard";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const ShopOwnerDashboard = () => {
  const { authUser } = useAuthStore();
  const [foodItems, setFoodItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchFoodItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/food-items/shop");
      // Only update if data actually changed
      if (JSON.stringify(data.foodItems) !== JSON.stringify(foodItems)) {
        setFoodItems(data.foodItems);
      }
      if (JSON.stringify(data.shop) !== JSON.stringify(shop)) {
        setShop(data.shop);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch food items"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authUser?.role === "shop-owner") {
      fetchFoodItems();
    }
  }, [authUser, fetchFoodItems]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axiosInstance.delete(`/food-items/${id}`);
      toast.success("Food item deleted successfully");
      fetchFoodItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const { data } = await axiosInstance.put(
        `/food-items/${id}/availability`,
        {
          isAvailable: !currentStatus,
        }
      );
      toast.success(
        `Item marked as ${!currentStatus ? "available" : "unavailable"}`
      );
      fetchFoodItems();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchFoodItems();
  };

  if (authUser?.role !== "shop-owner") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Unauthorized access</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* shop info */}
      <ShopDetailsCard shop={shop} refreshShopData={fetchFoodItems} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Food Items</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span className="">Add New Item</span>
        </button>
      </div>

      {showForm && (
        <FoodItemForm
          item={editingItem}
          localAreas={shop?.localAreas || []}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : foodItems.length === 0 ? (
        <button
          className="bg-gray-100 w-full p-8 rounded-lg text-center"
          onClick={() => setShowForm(true)}
        >
          <p className="text-gray-600">
            No food items found. Add your first item!
          </p>
        </button>
      ) : (
        <div className="space-y-3">
          {foodItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center border rounded-lg shadow-sm hover:shadow-md transition-all bg-white h-24 sm:h-28"
            >
              {/* Image - Fixed size square */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 m-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Content Area - Flex grow */}
              <div className="flex-1 flex h-full p-2 overflow-hidden min-w-0">
                {/* Text Content */}
                <div className="flex-1 min-w-0 px-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {item.name}
                    </h3>
                    <span className="font-bold text-blue-600 text-sm sm:text-base whitespace-nowrap">
                      taka:{item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {item.preparationTime}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Always on right side */}
                <div className="flex items-center justify-center gap-2 px-2 border-l border-gray-200">
                  <button
                    onClick={() =>
                      toggleAvailability(item._id, item.isAvailable)
                    }
                    className={`p-2 rounded-full transition-colors ${
                      item.isAvailable
                        ? "bg-green-100 hover:bg-green-200 text-green-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    aria-label={
                      item.isAvailable ? "Mark unavailable" : "Mark available"
                    }
                  >
                    {item.isAvailable ? (
                      <span className="text-xs font-medium">Available</span>
                    ) : (
                      <span className="text-xs font-medium">Unavailable</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition-colors"
                    aria-label="Edit item"
                  >
                    <Edit size={16} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 size={16} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* footer */}

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
