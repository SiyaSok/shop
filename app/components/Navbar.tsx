/** @format */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "@/public/images/logo.webp";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useCart } from "@/app/Context/CartContext"; // Adjust the path accordingly
import { IoIosCloseCircle } from "react-icons/io";
import { FaUserMinus } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const { cartItems, fetchCart, deleteItem, cartTotal, isLoading } = useCart();

  useEffect(() => {
    fetchCart(); // Use dynamic userId if needed
  }, []);

  /** Handle Search Input */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /** Submit Search */
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?Keywords=${encodeURIComponent(searchTerm)}`);
  };

  const handleDelete = async (productId: string) => {
    setDeletingItemId(productId);
    try {
      await deleteItem(productId);
    } catch (error: unknown) {
      setError("Error removing item. Please try again.");
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <nav className='bg-white border-b border-grey'>
      <div className='mx-auto container px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          {/* Logo */}
          <Link className='flex items-center' href='/'>
            <Image className='h-10 w-auto' src={logo} alt='PropertyPulse' />
          </Link>

          {/* Navbar Links */}
          <div className='hidden md:flex space-x-4'>
            {["Home", "Products", "About", "Contact"].map((name) => {
              const path =
                name.toLowerCase() === "home" ? "/" : `/${name.toLowerCase()}`;
              return (
                <Link
                  key={name}
                  href={path}
                  className={`${
                    pathname === path ? "bg-black text-white" : ""
                  } text-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}>
                  {name}
                </Link>
              );
            })}
          </div>
          {/* Icons */}
          <div className='flex items-center gap-4'>
            <Link href='/login'>
              <FaUserMinus className='text-4xl' />
            </Link>
            <button
              type='button'
              onClick={() => setIsSearchOpen((prev) => !prev)}>
              <IoSearchOutline className='text-4xl' />
            </button>
            <CiHeart className='text-4xl' />
            <div
              className='relative cursor-pointer'
              onMouseEnter={
                cartItems.length > 0 ? () => setIsCartOpen(true) : undefined
              }>
              <MdOutlineShoppingCart className='text-4xl' />
              {cartItems.length > 0 && (
                <span className='absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2'>
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal with Tailwind Animations */}
      {isCartOpen && cartItems && (
        <div
          className='fixed top-0 left-0 w-full h-full bg-black/50 z-40 flex justify-end transition-transform transform translate-x-0'
          onClick={(e) => {
            if ((e.target as HTMLElement).id === "cart-backdrop") {
              setIsCartOpen(false);
            }
          }}
          id='cart-backdrop'>
          <div className='absolute h-full right-0 w-92 bg-white shadow-lg py-4 px-8 z-50 transform transition-transform duration-300 ease-in-out translate-x-0'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold border-b py-4'>
                Shopping Cart
              </h2>
              <HiOutlineLockClosed className='text-2xl text-grey mr-4' />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}

            {cartItems.length > 0 ? (
              <ul className='h-9/10 overflow-y-auto'>
                {cartItems.map((item) => (
                  <li
                    key={item.productId}
                    className='flex items-center w-full py-2 gap-4 relative'>
                    {deletingItemId === item.productId && (
                      <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm'>
                        Removing...
                      </div>
                    )}
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className='rounded'
                    />
                    <div className='flex-grow'>
                      <p className='text-sm font-medium'>{item.title}</p>
                      <p className='text-xs text-gray-700 mt-2'>
                        {item.quantity} <span className='italic'>X</span>{" "}
                        <span className='text-yellow-700'>
                          R {item.price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.productId)}
                      className='text-gray-500 hover:text-red-700'>
                      <IoIosCloseCircle className='text-2xl' />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-xs text-gray-500'>Cart is empty</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
