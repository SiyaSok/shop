/** @format */

import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Product from "@/lib/modals/products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = async (request: Request, context: { params: any }) => {
  const productId = context.params.id; // Use camelCase for variable names

  try {
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Product Id not found or invalid" }),
        { status: 400 }
      );
    }

    await connect();

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(product), { status: 200 }); // Return the found product, not the Product model
  } catch (error) {
    console.error("Error fetching product:", error); // More descriptive error message
    return new NextResponse(
      JSON.stringify({ message: "Error fetching product" }), // Consistent wording
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
