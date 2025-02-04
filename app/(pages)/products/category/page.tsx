/** @format */

// app/shop/page.tsx (or app/shop/route.tsx if using file system routing) - Server Component
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  outOfStock: boolean;
  category?: { _id: string; name: string };
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await axios.get<Product[]>(
      "http://localhost:3000/api/products"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ShopPage() {
  // Note the async keyword
  const products = await getProducts(); // Fetch data here

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Shop123445</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {products.map((product) => (
          <div
            key={product._id}
            className='border rounded-lg shadow-md p-4 relative'>
            <Link href={`/products/${product._id}`} passHref legacyBehavior>
              <a className='block'>
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={300}
                  className='object-cover rounded-t-lg mb-2'
                />
                <h2 className='text-xl font-semibold mb-1 hover:underline'>
                  {product.title}
                </h2>
              </a>
            </Link>
            <p className='text-gray-600 mb-2 line-clamp-3'>
              {product.description}
            </p>
            <p className='text-lg font-bold'>${product.price}</p>
            {product.outOfStock && (
              <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm'>
                Out of Stock
              </div>
            )}
            <button className='mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Add to Cart
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
              <Link href={`/products/${product._id}`}> Shop</Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
