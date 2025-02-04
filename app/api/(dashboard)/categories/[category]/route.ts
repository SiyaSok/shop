/** @format */

import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Product from "@/lib/modals/products";

// export const GET = async (
//   request: Request,
//   { params }: { params: { category: string } } // Correct parameter name here
// ) => {
//   const categoryIdFromRoute = params.category; // Use category, not id
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");
//     const categoryIdFromQuery = searchParams.get("categoryId"); // If you also need it from query

//     if (!userId || !Types.ObjectId.isValid(userId)) {
//       return new NextResponse("user Id not found", { status: 400 });
//     }

//     // Decide which categoryId to use: from route or query parameter
//     let categoryId;
//     if (categoryIdFromRoute) {
//       categoryId = categoryIdFromRoute;
//     } else if (categoryIdFromQuery) {
//       categoryId = categoryIdFromQuery;
//     } else {
//       return new NextResponse("Category ID not found", { status: 400 });
//     }

//     if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
//       return new NextResponse("Category Id not found", { status: 400 });
//     }

//     await connect();

//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(JSON.stringify({ message: "User not found" }), {
//         status: 400,
//       });
//     }

//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return new NextResponse(
//         JSON.stringify({ message: "Category not found" }),
//         { status: 400 }
//       );
//     }

//     //  Now, you have the category ID.  You're missing the product ID.
//     //  Where is the product ID coming from in this route?  You'll need
//     //  to either include it in the route path (e.g., /categories/[category]/products/[product])
//     //  or pass it as a query parameter.  I'm going to assume you'll pass it as a query parameter
//     const productId = searchParams.get("productId");
//     if (!productId || !Types.ObjectId.isValid(productId)) {
//       return new NextResponse("Product Id not found", { status: 400 });
//     }

//     const product = await Product.findOne({
//       _id: productId,
//       category: new Types.ObjectId(categoryId),
//       user: new Types.ObjectId(userId),
//     });

//     if (!product) {
//       return new NextResponse(
//         JSON.stringify({ message: "Product not found" }),
//         {
//           status: 404,
//         }
//       );
//     }
//     return new NextResponse(JSON.stringify(product), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new NextResponse(
//       JSON.stringify({ message: "Error fetching Product" }),
//       { status: 500 }
//     );
//   }
// };
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const PATCH = async (request: Request, context: { params: any }) => {
//   const ProductId = context.params.Product;

//   try {
//     const body = await request.json();
//     const { title, description } = body;

//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");

//     if (!userId || !Types.ObjectId.isValid(userId)) {
//       return new NextResponse("user Id not found", { status: 400 });
//     }

//     if (!ProductId || !Types.ObjectId.isValid(ProductId)) {
//       return new NextResponse("Product Id not found", { status: 400 });
//     }
//     await connect();

//     const user = await User.findById(userId);

//     if (!user) {
//       return new NextResponse(JSON.stringify({ message: "User not found}" }), {
//         status: 400,
//       });
//     }

//     const product = await Product.findOne({ _id: ProductId, user: userId });

//     if (!product) {
//       return new NextResponse(
//         JSON.stringify({ message: "Product not found}" }),
//         {
//           status: 400,
//         }
//       );
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       ProductId,
//       { title, description },
//       { new: true }
//     );

//     return new NextResponse(
//       JSON.stringify({ message: "updated Product", category: updatedProduct }),
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return new NextResponse("Error in updated a Product: " + error.message, {
//         status: 500,
//       });
//     }
//     return new NextResponse("An unknown error occurred.", { status: 500 });
//   }
// };
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const DELETE = async (request: Request, context: { params: any }) => {
//   const ProductId = context.params.Product;
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");

//     if (!userId || !Types.ObjectId.isValid(userId)) {
//       return new NextResponse("user Id not found", { status: 400 });
//     }

//     if (!ProductId || !Types.ObjectId.isValid(ProductId)) {
//       return new NextResponse("Product Id not found", { status: 400 });
//     }

//     await connect();

//     const user = await User.findById(userId);

//     if (!user) {
//       return new NextResponse(JSON.stringify({ message: "User not found}" }), {
//         status: 400,
//       });
//     }

//     const product = await Product.findOne({ _id: ProductId, user: userId });

//     if (!product) {
//       return new NextResponse(
//         JSON.stringify({ message: "Product not found}" }),
//         {
//           status: 400,
//         }
//       );
//     }

//     await Product.findByIdAndDelete(ProductId);

//     return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
//       status: 200,
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return new NextResponse(
//         "Error in deleting the ProductId: " + error.message,
//         {
//           status: 500,
//         }
//       );
//     }
//     return new NextResponse("An unknown error occurred.", { status: 500 });
//   }
// };
