/** @format */

import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Product from "@/lib/modals/products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = async (request: Request, context: { params: any }) => {
  const ProductId = context.params.Product;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryid = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("user Id not found", { status: 400 });
    }
    if (!categoryid || !Types.ObjectId.isValid(categoryid)) {
      return new NextResponse("category Id not found", { status: 400 });
    }

    if (!ProductId || !Types.ObjectId.isValid(ProductId)) {
      return new NextResponse("Product Id not found", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found}" }), {
        status: 400,
      });
    }

    const category = await Category.findById(categoryid);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found}" }),
        { status: 400 }
      );
    }
    const product = await Product.findOne({
      _id: ProductId,
      category: new Types.ObjectId(categoryid),
      user: new Types.ObjectId(userId),
    });
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        {
          status: 404,
        }
      );
    }
    return new NextResponse(JSON.stringify(Product), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching Product" }),
      { status: 500 }
    );
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PATCH = async (request: Request, context: { params: any }) => {
  const ProductId = context.params.Product;

  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("user Id not found", { status: 400 });
    }

    if (!ProductId || !Types.ObjectId.isValid(ProductId)) {
      return new NextResponse("Product Id not found", { status: 400 });
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found}" }), {
        status: 400,
      });
    }

    const product = await Product.findOne({ _id: ProductId, user: userId });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found}" }),
        {
          status: 400,
        }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      ProductId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "updated Product", category: updatedProduct }),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error in updated a Product: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DELETE = async (request: Request, context: { params: any }) => {
  const ProductId = context.params.Product;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("user Id not found", { status: 400 });
    }

    if (!ProductId || !Types.ObjectId.isValid(ProductId)) {
      return new NextResponse("Product Id not found", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found}" }), {
        status: 400,
      });
    }

    const product = await Product.findOne({ _id: ProductId, user: userId });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found}" }),
        {
          status: 400,
        }
      );
    }

    await Product.findByIdAndDelete(ProductId);

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(
        "Error in deleting the ProductId: " + error.message,
        {
          status: 500,
        }
      );
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};
