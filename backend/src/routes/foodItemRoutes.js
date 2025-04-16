import express from "express";
import authUser from "../middlewares/userAuth.js";
import upload from "../libs/cloudinaryUpload.js";
import {
  createFoodItem,
  deleteFoodItem,
  getAllAvailableFoodItems,
  getFoodItemsByShop,
  getFoodItemsByShopId,
  getItemsForHomeByLocalArea,
  getShopsByLocalArea,
  toggleFoodItemAvailability,
  updateFoodItem,
} from "../controllers/foodItemController.js";
import shopOwner from "../middlewares/shopOwnerMiddleware.js";

const foodItemRouter = express.Router();

// Shop owner routes
foodItemRouter.post("/", authUser, upload.single("image"), createFoodItem);
foodItemRouter.get("/shop", authUser, getFoodItemsByShop);
foodItemRouter.put(
  "/:id",
  authUser,
  shopOwner,
  upload.single("image"),
  updateFoodItem
);

foodItemRouter.put(
  "/:id/availability",
  authUser,
  shopOwner,
  toggleFoodItemAvailability
);

foodItemRouter.delete("/:id", authUser, shopOwner, deleteFoodItem);

// Public route (for users)
foodItemRouter.get("/available", getAllAvailableFoodItems);
foodItemRouter.get("/", getShopsByLocalArea);
foodItemRouter.get("/search", getItemsForHomeByLocalArea);
foodItemRouter.get("/shop/:id", getFoodItemsByShopId);

export default foodItemRouter;
