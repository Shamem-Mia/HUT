import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/dbConnection.js";
import router from "./src/routes/authRoute.js";
import userRouter from "./src/routes/userRoute.js";
import ownerRouter from "./src/routes/ownerRoute.js";
import foodItemRouter from "./src/routes/foodItemRoutes.js";
import shopRouter from "./src/routes/shopRoute.js";
import deliveryRouter from "./src/routes/deliveryRoutes.js";
import { startDeliveryCleanupJob } from "./src/libs/deliveryCleanupJob.js";
import { startShopDailyUpdate } from "./src/libs/shopDailyUpdate.js";
import path from "path";
import deliveryManRouter from "./src/routes/deliveryManRouter.js";

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

connectDB();
startDeliveryCleanupJob();
startShopDailyUpdate();
// incrementSellDays();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// api end point
app.use("/api/auth", router);
app.use("/api/users", userRouter);
app.use("/api/owners", ownerRouter);
app.use("/api/shops", shopRouter);
app.use("/api/food-items", foodItemRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/delivery-man", deliveryManRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server started on PORT ${port} `);
});
