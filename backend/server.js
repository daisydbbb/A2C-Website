import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const port = process.env.PORT || 5001;
const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes); //http://localhost:5001/api/products

// error handling middleware must be under all the routes
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
