"use client"

import getUserSession from "@/actions/auth/getUserSession";
import { getOrders } from "@/actions/orders/getOrders";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, DollarSign, Package } from "lucide-react";

interface UserStats {
    lifetimeOrders: number;
    lifetimeSpent: number
    yearlyOrders: number;
    yearlySpent: number;
    monthlyOrders: number;
    monthlySpent: number;
}

export default function ProfilePage() {
    const [user, setUser] = useState< IUserEntity | null >(null)

    const [states, setStates] = useState<UserStats>({
        lifetimeOrders: 42,
        lifetimeSpent: 315168.75,
        yearlyOrders: 15,
        yearlySpent: 127830.12,
        monthlyOrders: 3,
        monthlySpent: 20000,
    })

    const [isloading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500)
        return () => clearTimeout(timer)
    })

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getUserSession()
            if(userData) setUser(userData)
            const orders = await getOrders()
            if(orders) {
                let lifetimeOrders = 0
                let lifetimeSpent = 0
                let yearlyOrders = 0
                let yearlySpent = 0
                let monthlyOrders = 0
                let monthlySpent = 0

                orders.items.forEach((order) => {
                    const orderDate = new Date(order.createdDate)
                    const orderYear = orderDate.getFullYear()
                    const orderMonth = orderDate.getMonth() + 1
                    const totalSum = parseFloat(order.totalSum)
                    const currentYear = new Date().getFullYear()
                    const currentMonth = new Date().getMonth() + 1

                    lifetimeOrders += 1
                    lifetimeSpent += totalSum

                    if(orderYear === currentYear) {
                        yearlyOrders += 1
                        yearlySpent += totalSum
                    }

                    if(orderYear === currentYear && orderMonth === currentMonth) {
                        monthlyOrders += 1
                        monthlySpent += totalSum
                    } 
                })
                setStates({
                    lifetimeOrders,
                    lifetimeSpent,
                    yearlyOrders,
                    yearlySpent,
                    monthlyOrders,
                    monthlySpent,
                })
            }
        }
        fetchData()
    }, [])

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
                        initial={{ y: -50 ,opacity: 0 }}
                        animate={{ y: 0 ,opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        My Profile
                    </motion.h1>

                    {isloading ? (
                        <div className="space-y-8">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
                                    <div className="space-x-2 flex-1">
                                        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
                                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                    ): (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-24 w-24 text-6xl text-customColor">
                                        <AvatarFallback className="bg-[#0F1724]">
                                            {user?.formData[0].value.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-semibold text-customColor">
                                            {user?.formData[0].value}
                                        </h2>
                                        <p className="text-gray-400">{user?.identifier}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-customColor">
                                        My Stats
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <StatCard 
                                            icon= {<Package className="size-8 text-customColor" />}
                                            title="Lifetime Orders"
                                            value={states.lifetimeOrders}
                                        />
                                        <StatCard 
                                            icon={<DollarSign className="size-8 text-customColor" />}
                                            title="Lifetime Spent"
                                            value={`₹${states.lifetimeSpent.toLocaleString("en-IN")}.00 spent`}
                                        />
                                        <StatCard 
                                            icon={<Calendar className="size-8 text-customColor" />}
                                            title="Yearly Order"
                                            value={`${states.yearlyOrders} orders`}
                                            subvalue={`₹${states.lifetimeSpent.toFixed(2)} spent`}
                                        />
                                    </div>
                                </motion.div>
                        </>
                    )}
                </motion.div>
        </div>
    )
}

function StatCard ({
    icon,
    title,
    value,
    subvalue,
}: {
    icon: React.ReactNode,
    title: string,
    value: string | number,
    subvalue?: string,
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-700 p-4 rounded flex items-center space-x-4"
        >
            {icon}
            <div>
                <h4 className="text-sm font-medium text-gray-400">{title}</h4>
                <p className="text-2xl font-bold text-customColor">{value}</p>
                {subvalue && <p className="text-sm text-gray-400">{subvalue}</p>}
            </div>
        </motion.div>
    )
}

