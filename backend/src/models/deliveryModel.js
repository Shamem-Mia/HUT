import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        category: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        _id: false, // Prevent automatic _id creation for subdocuments
      },
    ],
    deliveryDetails: {
      universityOrVillage: {
        type: String,
        required: true,
      },
      hallOrMoholla: {
        type: String,
        required: true,
      },
      roomOrIdentity: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: Number,
        required: true,
      },
      deliveryDate: {
        type: Date,
        required: true,
      },
      deliveryTime: {
        type: String,
        required: true,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["bkash", "nagad"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      paymentNumber: {
        type: Number,
        required: true,
      },
      transactionId: {
        type: String,
        required: true,
      },
    },
    deliveryPin: {
      type: Number,
      required: function () {
        return this.status === "approved" || this.status === "delivered";
      },
    },
    guestKey: {
      type: String,
    },
    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    selfDelivery: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "delivered"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
deliverySchema.index({ user: 1 });
deliverySchema.index({ shop: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ createdAt: -1 });

// a pre-save hook to set deliveredAt when status changes to 'delivered'
deliverySchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "delivered") {
      this.deliveredAt = new Date();
      this.verifiedAt = new Date();
    }
    // Clear verification timestamp if status changes from delivered
    if (this.status !== "delivered" && this.verifiedAt) {
      this.verifiedAt = null;
    }
  }
  next();
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
