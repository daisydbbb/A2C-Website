import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    // user that created the product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // product details
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    configuration: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    reviews: [reviewSchema], // array of reviews
    rating: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
