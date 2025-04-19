import express from "express";
import authUser from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import {
  approveAsDeliveryMan,
  deliveryManRequest,
  getApprovedDeliveriesForDeliveryMan,
  getDeliveryManRequestAdmin,
} from "../controllers/deliveryManController.js";

const deliveryManRouter = express.Router();

deliveryManRouter.post("/request", authUser, deliveryManRequest);
deliveryManRouter.get(
  "/requests",
  authUser,
  isAdmin,
  getDeliveryManRequestAdmin
);
deliveryManRouter.put("/requests/:id", authUser, isAdmin, approveAsDeliveryMan);
deliveryManRouter.get(
  "/:deliveryManId",
  authUser,
  getApprovedDeliveriesForDeliveryMan
);

export default deliveryManRouter;
