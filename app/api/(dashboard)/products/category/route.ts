/** @format */

import connect from "@/lib/db";
// import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import Product from "@/lib/modals/products";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

type Filter = {
  category: Types.ObjectId;
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
    // const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryid");

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or missing category ID", {
        status: 400,
      });
    }

    await connect();

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    const filter: Filter = {
      category: new Types.ObjectId(categoryId),
    };

    // const skip = (page - 1) * limit;
    const Products = await Product.find(filter);

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
    // const userId = searchParams.get("userId");
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
