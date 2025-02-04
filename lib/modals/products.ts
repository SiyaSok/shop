/** @format */

import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: "string", required: true },
    description: { type: "string" },
    price: { type: "number" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    image: { type: "string" },
    outOfStock: { type: "boolean", default: false }, // Added out of stock field
  },
  {
    timestamps: true,
  }
);

const Product = models.product || model("product", ProductSchema);

export default Product;
