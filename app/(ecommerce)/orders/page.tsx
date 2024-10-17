"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getOrders } from "@/actions/orders/getOrders";
import { AlertCircle, CheckCircle, Package, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number | null;
}

interface OrderItem {
  id: number;
  createdData: string;
  statusIdentifier: string;
  totalSum: string;
  products: Product[];
}

interface IOrder {
  items: OrderItem[];
  total: number;
}

const orderStatusIcons = {
  processing: <Package className="size-5 text-yellow-500" />,
  shipped: <Truck className="size-5 text-blue-600" />,
  delivered: <CheckCircle className="size-5 text-green-600" />,
  cancelled: <AlertCircle className="size-5 text-red-600" />,
};

const MyOrders = () => {
  const [orders, setOrders] = useState<IOrder>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      console.log({ data });
      if (data !== undefined)
        setOrders({ items: data.items.reverse(), total: data.total });
      else setOrders({ total: 0, items: [] });
      setIsLoading(false);
    };

    fetchOrders();
  }, []);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-customColor to-[#00CCCC]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My Orders
        </motion.h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {orders?.items?.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold text-customColor">
                      Order #{order.id}
                    </h2>
                    <Badge className="flex items-center">
                      {/* Check if the icon exists and fallback to null */}
                      {orderStatusIcons[order.statusIdentifier] || null}
                      <span className="ml-2 capitalize">
                        {order.statusIdentifier || "Unknown Status"}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex justify-between text-gray-400 mb-4">
                    <span>
                      Order Date:{" "}
                      {order.createdDate?.includes("T")
                        ? order.createdDate.split("T")[0] // Use createdDate instead of createdData
                        : "Unknown"}
                    </span>
                    <span>Total: {parseFloat(order.totalSum).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="items">
                      <AccordionTrigger className="text-customColor hover:text-[#00CCCC]">
                        View Order Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-x-4 mt-4">
                          {order.products.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4"
                            >
                              <div className="flex-1">
                                <h3 className="font-semibold text-customColor">
                                  {item.title}
                                </h3>
                                <p className="text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <span>
                                ₹ {item.price.toLocaleString("en-IN")}.00
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="bg-gray-700 p-4 flex justify-between items-center">
                  <Button className="text-customColor border-customColor hover:bg-customColor hover:text-gray-800">
                    Track Order
                  </Button>
                  <Button className="text-gray-400 hover:text-customColor">
                    Need any help?
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default MyOrders;
