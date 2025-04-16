import express from "express";
import authUser from "../middlewares/userAuth.js";
import {
  approveShopOwnership,
  getShopOwnershipRequests,
  rejectShopOwnership,
  shopOwnershipRequest,
} from "../controllers/ownerController.js";

const ownerRouter = express.Router();

ownerRouter.post("/shop-ownership-request", authUser, shopOwnershipRequest);
ownerRouter.get("/shop-ownership-request", authUser, getShopOwnershipRequests);
ownerRouter.put("/approve-ownership/:id", authUser, approveShopOwnership);
ownerRouter.delete("/reject-ownership/:id", authUser, rejectShopOwnership);

export default ownerRouter;
