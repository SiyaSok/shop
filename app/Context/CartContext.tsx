/** @format */

"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
  category: string;
  _id: string;
}

interface Form {
  username: string;
  password: string;
}

// Define Cart Context Type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: string) => void;
  fetchCart: () => Promise<void>;
  deleteItem: (item: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  cartTotal: number;
  isRegister: boolean;
  formData: Form;
  message: string;
  userId: number | null;
  setIsRegister: (value: boolean) => void;
  isLoading: boolean;
}

// Create Context with Default Values
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<Form>({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("Cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const id = localStorage.getItem("id");
    if (id) {
      setUserId(Number(id));
      setIsLoading(true);
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get<{
        items: CartItem[];
        _id: string;
        totalPrice: number;
      }>(`http://localhost:3000/api/cart?userId=${userId}`);
      if (response.data.items) {
        setCartItems(response.data.items);
        setCartId(response.data._id);
        setCartTotal(response.data.totalPrice);
        localStorage.setItem("Cart", JSON.stringify(response.data.items));
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (id: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: {
            productId: id,
            quantity: 1,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCartItems(data.items);
      setCartId(data._id);
      setCartTotal(data.totalPrice);
      localStorage.setItem("Cart", JSON.stringify(data));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(
        `/api/cart/product/${id}?cartItemId=${cartId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCartItems(data.cart.items);
      localStorage.setItem("Cart", JSON.stringify(data));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = isRegister ? "/api/users" : "/api/login";
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(response.data.message || "Success!");
      setUserId(response.data.user?.id || null);
      setIsLoading(true);
      if (response.data.user?.id) {
        localStorage.setItem("id", String(response.data.user.id));
      }
      router.push("/products");
    } catch (error) {
      // setMessage(error.response?.data?.message || "Something went wrong!");
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        fetchCart,
        deleteItem,
        cartTotal,
        formData,
        setIsRegister,
        handleChange,
        handleSubmit,
        message,
        userId,
        isRegister,
        isLoading,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Export CartContext for external use
export { CartContext };
