import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

connectDB();

const port = process.env.PORT || 5001;
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes); //http://localhost:5001/api/products
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
// paypal route
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
// image upload route
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve(); // set __dirname to the root directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// error handling middleware must be under all the routes
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
