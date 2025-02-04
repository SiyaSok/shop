/** @format */

import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: "string", required: true },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
