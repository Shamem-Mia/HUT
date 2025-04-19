import mongoose from "mongoose";

const deliveryManRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  workArea: { type: String, required: true },
  age: { type: Number, required: true },
  profession: { type: String, required: true },
  vehicleType: {
    type: String,
    enum: ["bicycle", "motorcycle", "car", "walking"],
    default: "bicycle",
  },
  experience: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});
const DeliveryManRequest = mongoose.model(
  "DeliveryManRequest",
  deliveryManRequestSchema
);

export default DeliveryManRequest;
