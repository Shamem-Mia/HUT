import cron from "node-cron";
import Shop from "../models/shopModel.js";

export const startShopDailyUpdate = () => {
  // Schedule to run daily at 12:05 PM
  cron.schedule("5 12 * * *", async () => {
    try {
      const now = new Date();
      if (now.getHours() >= 12) {
        await Shop.updateMany(
          { isOpen: true },
          {
            $inc: { sellDays: 1 },
            $set: { lastResetDate: now },
          }
        );
        console.log("✅ Updated sellDays for all open shops");
      }
    } catch (error) {
      console.error("❌ Cron job failed:", error);
    }
  });
};
