import { CronJob } from "cron";
import cleanupDeliveries from "./deliveryCleanup.js";

// Runs every hour at the 0th minute (e.g., 1:00, 2:00, etc.)
const job = new CronJob("0 3 * * *", async () => {
  await cleanupDeliveries();
});

export const startDeliveryCleanupJob = () => {
  job.start();
};
