/** @format */

import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import Product from "@/lib/modals/products";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

type Filter = {
  $or?: Array<{
    [key: string]: { $regex: string; $options: string };
  }>;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
};

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const searchKeywords = searchParams.get("Keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "16");
    const sortOrder = searchParams.get("sortOrder") || "1"; // Default sort order is now ascending (1)
    const sortBy = searchParams.get("sortBy") || "tiltle"; // Default sort field is now "name"

    await connect();

    const filter: Filter = {};

    if (searchKeywords) {
      const escapedKeywords = searchKeywords.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      const regexPattern = escapedKeywords.split(/\s+/).join(".*");

      filter.$or = [
        { title: { $regex: regexPattern, $options: "i" } },
        { description: { $regex: regexPattern, $options: "i" } },
      ];
    }

    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === "-1" ? -1 : 1; //  1 for ascending, -1 for descending.  Reverse the conditional to default to ascending.
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const Products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    return new NextResponse(JSON.stringify(Products), { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse("Error in fetching Products: " + errorMessage, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description, price, image, outOfStock } = body;

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or missing category ID", {
        status: 400,
      });
    }

    await connect();

    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    const newProduct = new Product({
      title,
      description,
      price,
      image,
      outOfStock,
      category: new Types.ObjectId(categoryId),
    });

    await newProduct.save();

    return new NextResponse(JSON.stringify(newProduct), { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse("Error in creating Products: " + errorMessage, {
      status: 500,
    });
  }
};
