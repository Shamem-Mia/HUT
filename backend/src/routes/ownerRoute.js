import express from "express";
import authUser from "../middlewares/userAuth.js";
import {
  approveShopOwnership,
  getShopOwnershipRequests,
  rejectShopOwnership,
  shopOwnershipRequest,
} from "../controllers/ownerController.js";
import isAdmin from "../middlewares/adminMiddleware.js";

const ownerRouter = express.Router();

ownerRouter.post("/shop-ownership-request", authUser, shopOwnershipRequest);
ownerRouter.get(
  "/shop-ownership-request",
  authUser,
  isAdmin,
  getShopOwnershipRequests
);
ownerRouter.put(
  "/approve-ownership/:id",
  authUser,
  isAdmin,
  approveShopOwnership
);
ownerRouter.delete(
  "/reject-ownership/:id",
  authUser,
  isAdmin,
  rejectShopOwnership
);

export default ownerRouter;
