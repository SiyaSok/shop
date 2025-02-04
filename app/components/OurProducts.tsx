/** @format */

// components/OurProducts.tsx (Client Component - Now fetches data on the client)
import axios from "axios";
import { useState, useEffect } from "react"; // Import useState and useEffect
import Product from "./Products";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  outOfStock: boolean;
  category?: { _id: string; name: string };
}

const OurProducts = () => {
  // No longer async
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const response = await axios.get<Product[]>(
          "http://localhost:3000/api/products?limit=8"
        );
        setProducts(response.data);
      } catch (err: unknown) {
        setError((err as Error).message); // Set the error message
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <p>Loading products...</p>; // Display a loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Display an error message
  }

  const simplifiedProducts = products.map(simplifyProduct);

  return <Product products={simplifiedProducts} />; // Return the products (no longer a Promise)
};

export default OurProducts;

// components/Products.tsx (Client Component - Product display component)
// ... (This component remains the same as in the previous example)
