/** @format */

"use client";

import { useCart } from "@/app/Context/CartContext";

export default function AuthPage() {
  const {
    isRegister,
    formData,
    handleChange,
    handleSubmit,
    message,
    setIsRegister,
  } = useCart();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-md w-80'>
        <h2 className='text-xl font-semibold text-center mb-4'>
          {isRegister ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            className='w-full p-2 mb-3 border rounded'
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className='w-full p-2 mb-3 border rounded'
            required
          />
          <button
            type='submit'
            className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        {message && <p className='text-center text-red-500 mt-2'>{message}</p>}
        <p className='text-center mt-4 text-sm'>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className='text-blue-500 hover:underline'>
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
