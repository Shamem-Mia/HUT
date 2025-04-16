import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    localAreas: {
      // Changed from localArea to localAreas (array)
      type: [String], // Array of strings
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.every(
            (area) => typeof area === "string" && area.trim().length > 0
          );
        },
        message: "Please provide at least one local area",
      },
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    shopCategory: {
      type: String,
      required: true,
      enum: [
        "Food Delivery",
        "Library",
        "Stationery",
        "Printing",
        "Confectionary",
        "Electronics",
        "Clothing",
        "Laundry Services",
        "Pharmacy",
        "Old Books",
        "Others",
      ],
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    BkashNumber: {
      type: Number,
      required: true,
    },
    NagadNumber: {
      type: Number,
      required: true,
    },
    shopPin: {
      type: Number,
      unique: true,
    },
    deliveryCount: {
      type: Number,
      default: 0,
    },
    totalSellPrice: {
      type: Number,
      default: 0,
    },
    sellDays: {
      type: Number,
      default: 1,
      min: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    lastResetDate: { type: Date },
    deliveryCharge: {
      type: [],
      default: 0,
    },
  },

  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
