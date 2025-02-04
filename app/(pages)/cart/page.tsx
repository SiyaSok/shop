/** @format */

import Cart from "@/app/components/Cart";
import axios from "axios";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
  category: string;
  _id: string;
  description?: string;
  outOfStock?: boolean;
}

interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  image: string;
  outOfStock?: boolean;
  category?: {
    _id: string;
    name: string;
  };
}

async function getProducts(): Promise<CartItem[]> {
  try {
    const response = await axios.get<{ items: CartItem[] }>(
      "http://localhost:3000/api/cart?userId=679db65928ba7710611593d9"
    );
    console.log(response.data);
    return response.data.items ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function simplifyProduct(product: CartItem) {
  return {
    _id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    image: product.image,
    outOfStock: product.outOfStock ?? false,
    category: product.category
      ? { _id: product.category, name: product.category }
      : null,
  };
}

export default async function ShopPage() {
  const products = await getProducts();

  if (products.length === 0) {
    return <div>No products found.</div>;
  }

  const simplifiedProducts = products.map(simplifyProduct);
  return (
    <Cart
      products={simplifiedProducts.map((product) => ({
        ...product,
        description: product.description ?? "",
      }))}
    />
  );
}
