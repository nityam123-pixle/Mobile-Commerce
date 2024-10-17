"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/stores/cartStore";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import getUserSession from "@/actions/auth/getUserSession";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  LogIn,
  Minus,
  Plus,
  ShoppingBagIcon,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IOrderData } from "oneentry/dist/orders/ordersInterfaces";
import createOrder from "@/actions/orders/createOrder";

const Cart = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const [user, setUser] = useState<IUserEntity | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subTotal * 0.1;
  const total = subTotal + tax;

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserSession();
        if (userData) setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const CreateOrderAndCheckOut = async () => {
    const data: IOrderData = {
      formData: [],
      formIdentifier: "order-form",
      paymentAccountIdentifier: "stripe",
      products: cartItems.map((item) => ({
        productId: Number(item.id),
        quantity: item.quantity,
      })),
    };
    const url = await createOrder(data)
    clearCart();
    router.push(url)
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-customColor to-[#00CCCC]"
        >
          Your Cart
        </motion.h1>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={
                      "w-16 h-16 bg-gray-700 rounded-md sm:w-20 sm:h-20"
                    }
                  ></div>
                  <div className={"flex-1 space-y-2"}>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                {/*<div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>*/}
                {/*<div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>*/}
                {/*<div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>*/}
                {/*<div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>*/}
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 relative overflow-hidden"
                >
                  <div
                    className={
                      "flex flex-col sm:flex-row sm:items-center sm:space-x-4 "
                    }
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-customColor line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-400">
                          ₹ {item.price.toLocaleString("en-IN")}.00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-1">
                      <div className="flex items-center space-x-2">
                        <Button
                          size={"icon"}
                          className="text-customColor border-customColor hover:bg-customColor hover:text-gray-900"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="size-4 " />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity}
                          className="w-16 bg-gray-700 border-gray-600 text-clip text-customColor"
                        />
                        <Button
                          size={"icon"}
                          className="text-customColor border-customColor hover:bg-customColor hover:text-gray-900"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="size-4 " />
                        </Button>
                      </div>
                      <Button
                        className="text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 ml-4"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isLoading && cartItems.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-customColor/10">
                <ShoppingBagIcon className="size-10 text-customColor" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                It&apos;s Quiet Here nothing in Cart
              </h2>
              <p className="mb-8 mt-2 text-center text-font-medium leading-6 text-muted-foreground max-w-sm mx-auto">
                Add Products to see them. You dont have any products in the
                Cart.......
              </p>
              <Button className="bg-customColor hover:border hover:border-customColor text-gray-800 hover:bg-gray-900 hover:text-customColor">
                <Link href={"/"}>Shop Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
            <motion.div
              className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-customColor">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>SubTotal</span>
                  <span>₹{subTotal.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-customColor">
                    ₹{total.toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>
              {user ? (
                <Button
                  className="w-full mt-6 bg-customColor hover:bg-[#00CCCC] text-gray-900 font-semibold"
                  disabled={!cartItems.length}
                  onClick={CreateOrderAndCheckOut}
                >
                  <CreditCard className="mr-2 size-5" />
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="w-full mt-6 bg-customColor hover:bg-[#00CCCC] text-gray-900 font-semibold"
                  onClick={() => router.push("/auth?type=login")}
                >
                  <LogIn className="mr-2 size-5" />
                  Login to CheckOut
                </Button>
              )}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
