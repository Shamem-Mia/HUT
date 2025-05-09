import Delivery from "../models/deliveryModel.js";

const cleanupDeliveries = async () => {
  try {
    const threeHoursAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await Delivery.deleteMany({
      status: "delivered",
      verifiedAt: { $lte: threeHoursAgo },
    });

    return result;
  } catch (err) {
    console.error("Delivery cleanup error:", err);
    throw err;
  }
};

// For manual triggering if needed
export const manualCleanup = async (req, res) => {
  try {
    const result = await cleanupDeliveries();
    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// For scheduled jobs
export default cleanupDeliveries;
