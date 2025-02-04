/** @format */

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Product from "@/app/components/Products";

export default function Page() {
  const searchParams = useSearchParams();
  const Keywords = searchParams.get("Keywords") || "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/products?Keywords=${encodeURIComponent(
            Keywords
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");

        setProducts(await res.json());
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    }

    fetchProducts();
  }, [Keywords]);

  if (!products.length) {
    return <div>No products found.</div>;
  }

  return <Product products={products} />;
}
