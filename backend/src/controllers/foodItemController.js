import FoodItem from "../models/foodItemModel.js";
import Shop from "../models/shopModel.js";

// @desc    Create a new food item
// @route   POST /api/food-items
// @access  Private/ShopOwner
export const createFoodItem = async (req, res) => {
  try {
    const { name, description, price, category, preparationTime, localAreas } =
      req.body;

    // Find the shop owned by the current user
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const foodItem = new FoodItem({
      name,
      description,
      price,
      category,
      preparationTime,
      localAreas,
      image: req.file.path,
      shop: shop._id,
    });

    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all food items for a shop (owner view)
// @route   GET /api/food-items/shop
// @access  Private/ShopOwner
export const getFoodItemsByShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const foodItems = await FoodItem.find({ shop: shop._id });
    res.status(200).json({
      success: true,
      shop: shop,
      foodItems: foodItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/food-items/:id
// @access  Private/ShopOwner
export const updateFoodItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, preparationTime } =
      req.body;

    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Verify the food item belongs to the owner's shop
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop || !foodItem.shop.equals(shop._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    foodItem.name = name || foodItem.name;
    foodItem.description = description || foodItem.description;
    foodItem.price = price || foodItem.price;
    foodItem.category = category || foodItem.category;
    foodItem.isAvailable =
      isAvailable !== undefined ? isAvailable : foodItem.isAvailable;
    foodItem.preparationTime = preparationTime || foodItem.preparationTime;
    foodItem.image = req.file?.path || foodItem.image;

    await foodItem.save();
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle food item availability
// @route   PATCH /api/food-items/:id/availability
// @access  Private/ShopOwner
export const toggleFoodItemAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Verify the food item belongs to the owner's shop
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop || !foodItem.shop.equals(shop._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    foodItem.isAvailable = isAvailable;
    await foodItem.save();

    res.json({
      success: true,
      message: `Item marked as ${isAvailable ? "available" : "unavailable"}`,
      foodItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update availability",
    });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/food-items/:id
// @access  Private/ShopOwner
export const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Verify the food item belongs to the owner's shop
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop || !foodItem.shop.equals(shop._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Use deleteOne() or findByIdAndDelete() instead of remove()
    await FoodItem.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: "Food item deleted successfully",
      deletedItemId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete food item",
    });
  }
};

// @desc    Get all available food items (for users)
// @route   GET /api/food-items/available
// @access  Public
export const getAllAvailableFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ isAvailable: true }).populate(
      "shop",
      "shopName localArea"
    );
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetching the local area for foodMenuPage

// In your foodItemController.js
// @desc    Get shops by local area
// @route   GET /api/shops/search
// @access  Public
export const getShopsByLocalArea = async (req, res) => {
  try {
    const { localArea } = req.query;

    if (!localArea) {
      return res.status(400).json({ message: "Local area is required" });
    }

    const shops = await Shop.find({
      localAreas: { $in: [new RegExp(localArea, "i")] },
      status: "approved",
    }).select("shopName localAreas shopCategory shopPin isOpen image");

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemsForHomeByLocalArea = async (req, res) => {
  try {
    const { area } = req.query;

    if (!area) {
      return res.status(400).json({ message: "Area parameter is required" });
    }

    const trimmedArea = area.trim();

    // Find food items with case-insensitive search
    const foodItems = await FoodItem.find({
      localAreas: {
        $elemMatch: {
          $regex: new RegExp(`^${trimmedArea}$`, "i"),
        },
      },
    }).populate({
      path: "shop",
      select: "shopName shopPin isOpen image address localAreas contactNumber", // all fields you need
    });

    if (!foodItems.length) {
      return res.status(404).json({
        message: "No food items found in this area",
        foodItems: [],
        shop: null,
      });
    }

    // const shopIds = [...new Set(foodItems.map((item) => item.shop?._id))];

    // const shops = await Shop.find({
    //   _id: { $in: shopIds },
    // });

    // console.log("foodItems", foodItems);

    res.status(200).json({ foodItems });
  } catch (error) {
    console.error("Error in getItemsForHomeByLocalArea:", error);
    res.status(500).json({
      message: "Server error while searching for food items",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// @desc    Get food items by shop ID (public)
// @route   GET /api/food-items/shop/:id
// @access  Public
export const getFoodItemsByShopId = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const foodItems = await FoodItem.find({
      shop: shop._id,
      isAvailable: true,
    });

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
