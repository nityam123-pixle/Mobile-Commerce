"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Bell,
  Heart,
  LogOut,
  MenuIcon,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import getUserSession from "@/actions/auth/getUserSession";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logoutAction from "@/actions/auth/logout";
import useCartStore from "@/stores/cartStore";

const Navbar = () => {
  const [isScrolled, setisScrolled] = useState(false);
  const [isSearchOpen, setisSearchOpen] = useState(false);
  const [searchQuery, setsearchQuery] = useState("");
  const [typingText, settypingText] = useState("");
  const [user, setUser] = useState<IUserEntity | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const cartItems = useCartStore((state) => state.cart )
  const router = useRouter();

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
    const handleScroll = () => {
      setisScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      const text = "Search products....";
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          settypingText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);
    } else {
      settypingText("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileRef.current &&
        !mobileRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length) {
      router.push(`/search?searchTerm=${searchQuery}`);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
    setUser(null);
    setIsMobileMenuOpen(false)
  };

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.span
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#00CCCC]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OneStore
              </motion.span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              className="relative"
              initial={false}
              animate={isSearchOpen ? "open" : "closed"}
              ref={searchRef}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="flex items-center"
                variants={{
                  open: { width: "300px" },
                  closed: { width: "36px" },
                }}
              >
                <Input
                  type="text"
                  placeholder={typingText}
                  value={searchQuery}
                  className="bg-gray-800 border-gray-700 text-white w-full"
                  onChange={(e) => setsearchQuery(e.target.value)}
                />
                <Button
                  className="absolute right-0 top-0 bottom-0"
                  type="submit"
                  size={"icon"}
                  onClick={() => !isSearchOpen && setisSearchOpen(true)}
                >
                  <Search className="size-5 text-gray-300 hover:text-[#00FFFF]" />
                </Button>
              </motion.form>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/wishlist"
              onClick={handleMenuItemClick}
              >
                <Button size={"icon"}>
                  <Heart className="size-5 text-gray-300 hover:text-[#00FFFF]" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart"
                onClick={handleMenuItemClick}
              >
                <Button size={"icon"} className="relative">
                  <ShoppingCart className="size-5 text-gray-300 hover:text-[#00FFFF]" />
                  {cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs
                      font-bold leading-none text-white bg-red-500 rounded-full">{cartItems.length}</span>
                  )}
                </Button>
              </Link>
            </motion.div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-customColor">
                        {user.formData
                          .find((f) => f.marker === "name")
                          ?.value?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-gray-900 border-gray-800 text-gray-100"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-customColor">
                        {user.formData.find((f) => f.marker === "name")?.value}
                      </p>
                      <p className="text-xs leading-none text-gray-400">
                        {user?.identifier}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-customColor">
                    <Link href="/profile" className="flex w-full">
                      <User className="size-5 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-customColor">
                    <Bell className="size-4 mr-2" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-customColor">
                    <Link href="/orders" className="flex w-full">
                      <ShoppingBag className="size-4 mr-2" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    className="focus:bg-gray-800 focus:text-customColor"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4 mr-2" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth?type=login">
                    <Button
                      variant={"outline"}
                      className="bg-transparent text-customColor border-customColor hover:bg-customColor hover:text-black"
                    >
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth?type=signup">
                    <Button className="bg-customColor text-black hover:bg-[#00CCCC]">
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="size-6 text-gray-300" />
              ) : (
                <MenuIcon className="size-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            ref={mobileRef}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <form onSubmit={handleSubmit} className="mb-4">
                <Input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setsearchQuery(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white w-full"
                />
              </form>
              <Link
                href="/wishlist"
                className="text-gray-300 hover:text-[#00FFFF] block px-3 py-2 rounded-lg text-lg"
                onClick={handleMenuItemClick}
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                className="text-gray-300 hover:text-[#00FFFF] block px-3 py-2 rounded-lg text-lg"
                onClick={handleMenuItemClick}
              >
                Cart
              </Link>
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              {user && (
                <div className="flex items-center px-5 mb-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-customColor">
                        {user.formData
                          .find((f) => f.marker === "name")
                          ?.value?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.formData.find((f) => f.marker === "name")?.value}
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      {user.identifier}
                    </div>
                  </div>
                </div>
              )}
              {user ? (
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/notifications"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    Notifications
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    Orders
                  </Link>
                  <Button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 text-center"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/auth?type=login"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth?type=signup"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={handleMenuItemClick}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
