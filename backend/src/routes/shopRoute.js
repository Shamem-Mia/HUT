import express from "express";
import authUser from "../middlewares/userAuth.js";
import {
  getShopById,
  getShopByPin,
  getShopFromFoodItem,
  resetDeliveryCount,
  toggleShopStatus,
  updateDeliveryCharge,
  updateShop,
} from "../controllers/shopController.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import shopOwner from "../middlewares/shopOwnerMiddleware.js";
import { resetShopStats } from "../controllers/deliveryController.js";

const shopRouter = express.Router();

shopRouter.get("/:id", getShopById);
shopRouter.get("/item/:id", getShopFromFoodItem);

shopRouter.put("/:id/delivery-charge", updateDeliveryCharge);
shopRouter.put("/:id/reset-stats", authUser, shopOwner, resetShopStats);

shopRouter.get("/pin/:shopPin", authUser, isAdmin, getShopByPin);

shopRouter.put("/:id/toggle-status", authUser, shopOwner, toggleShopStatus);

shopRouter.get("/:id", authUser, isAdmin, getShopById);

shopRouter.put("/:id", authUser, isAdmin, updateShop);

shopRouter.patch(
  "/:id/reset-deliveries",
  authUser,
  isAdmin,
  resetDeliveryCount
);

export default shopRouter;
