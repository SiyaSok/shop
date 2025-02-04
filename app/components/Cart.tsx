/** @format */
"use client";
// app/components/Product.tsx (Client Component)
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductProps {
  products: {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    outOfStock: boolean;
    category: { _id: string; name: string } | null;
  }[];
}

const Cart: React.FC<ProductProps> = ({ products }) => {
  const [cart, setCart] = useState([]); // Initialize cart as an empty array

  const removeFromCart = (productToRemove) => {
    setCart(cart.filter((product) => product._id !== productToRemove._id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };
  const addToCart = async (product: {
    _id: string;
    title: string;
    price: number;
    image: string;
  }) => {
    try {
      const userId = "679db65928ba7710611593d9"; // Replace with actual user ID logic
      const existingItem = cart.find((item) => item.productId === product._id);

      const updatedItems = existingItem
        ? cart.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cart, { productId: product._id, quantity: 1 }];

      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: updatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Assuming your API returns the updated cart data
      setCart(data.items); // Update cart state with the response
      localStorage.setItem("Cart", JSON.stringify(data.items));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart. Please try again."); // User-friendly error message
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Cart</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-[68%]'>
          {products.map((product) => (
            <div key={product._id} className='border rounded p-4 mb-4 relative'>
              {" "}
              {/* Added margin-bottom */}
              <div className='flex flex-col md:flex-row items-center gap-4 '>
                <div className='relative overflow-hidden rounded w-[150px] h-[150px] shrink-0'>
                  <Image
                    src={product.image}
                    alt={product.title}
                    style={{ objectFit: "cover" }}
                    width={150}
                    height={150}
                    className='transition-opacity duration-300 group-hover:opacity-70'
                  />
                </div>
                <div className='md:text-left text-center'>
                  <h2 className='text-xl font-semibold mb-1 hover:underline line-clamp-1'>
                    {product.title}
                  </h2>
                  <p className='text-gray-600 mb-2 line-clamp-3 hidden md:block'>
                    {product.description}
                  </p>
                  <p className='text-lg font-bold'>${product.price}</p>
                </div>
                <div className='mt-4 flex justify-center md:justify-end'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
                    onClick={() => addToCart(product)}
                    disabled={cart.some((item) => item._id === product._id)} // Disable if already in cart
                  >
                    {cart.some((item) => item._id === product._id)
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </button>
                  <Link
                    href={`/products/${product._id}`}
                    passHref
                    legacyBehavior>
                    <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
                      Shop
                    </button>
                  </Link>
                </div>
              </div>
              {product.outOfStock && (
                <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm'>
                  Out of Stock
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='w-full lg:w-[30%] mt-6 lg:mt-0 border rounded p-4'>
          {" "}
          {/* Added border and padding to cart summary */}
          <h2 className='text-xl font-semibold mb-4'>Cart Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className='flex items-center justify-between mb-2'>
                    <span>{item.title}</span>
                    <span>${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item)}
                      className='text-red-500 hover:text-red-700'>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className='mt-4 border-t pt-2'>
                {" "}
                {/* Added separator line */}
                <p className='font-bold'>
                  Total: ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          )}
          <Link href='/' passHref legacyBehavior>
            <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full'>
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
