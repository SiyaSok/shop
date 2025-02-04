/** @format */
"use client";
import Product from "@/app/components/Products";
import SortFilter from "@/app/components/SortFilter";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  outOfStock: boolean;
  category?: { _id: string; name: string };
}

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(16);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number | null>(null);

  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.forEach((value, key) => {
    newSearchParams.set(key, value.replace("=", ""));
  });
  let cat = newSearchParams.toString().replace("=", "");
  function simplifyProduct(product: Product) {
    return {
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      outOfStock: product.outOfStock,
      category: product.category
        ? { _id: product.category._id, name: product.category.name }
        : null,
    };
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const url = cat
          ? `/api/products/category/${cat}?limit=${limit}&sortBy=${selectedCategory}&sortOrder=${sortOrder}`
          : filteredCategory
          ? `/api/products/category/${filteredCategory}?limit=${limit}&sortBy=${selectedCategory}&sortOrder=${sortOrder}`
          : `/api/products?limit=${limit}&sortBy=${selectedCategory}&sortOrder=${sortOrder}`;

        const response = await axios.get<Product[]>(url);
        setProducts(response.data);
        setProductsTotal(response.data.length);
        cat = "";
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [limit, selectedCategory, sortOrder, filteredCategory, cat]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  const simplifiedProducts = products.map(simplifyProduct);

  const handleLimitChange = (newLimit: number) => setLimit(newLimit);
  const handleSortChange = (newSort: string) => {
    if (newSort === "highToLow") {
      setSortOrder(-1);
      setSelectedCategory("price");
    } else {
      setSelectedCategory(newSort);
      setSortOrder(1);
    }
  };

  const handleCategoryChange = (categoryId: string) =>
    setFilteredCategory(categoryId);

  return (
    <>
      <SortFilter
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        limit={limit}
        productsTotal={productsTotal}
      />
      <Product products={simplifiedProducts} />
    </>
  );
};

export default Page;
