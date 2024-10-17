import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IProduct } from "@/types/product";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import useCartStore from "@/stores/cartStore";
import { toast } from "@/hooks/use-toast";

const ProductCard = ({ product }: { product: any }) => {

  const addToCart = useCartStore(state=>state.addToCart)

  const handleAddToCart = (product: IProduct) => {
    addToCart({
      id: product.id,
      name: product.localizeInfos?.title,
      price: product.price,
      quantity: 1,
      image: product.attributeValues.p_image.value.downloadLink,
    })
    toast({
      title: "Added item to the Cart",
      description: `${product.attributeValues.p_title.value} has been added to your cart.`,
      variant: "tealBlack",
      duration: 3000
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="group relative bg-gray-800 border-gray-700 overflow-hidden group h-full flex-col rounded-lg shadow-lg">
        <div className="relative w-full pt-[100%] bg-transparent">
          <Image
            src={
              product.attributeValues.p_image.value.downloadLink ||
              "/default-image.jpg"
            }
            alt={product.localizeInfos?.title}
            layout="fill"
            objectFit="container"
            className="transition-transform duration-300 group-hover:scale-110 saturate-200"
          />
        </div>
        <div className="p-4 flex-grow">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xl mb-2 text-white group-hover:text-customColor transition-colors duration-300 line-clamp-2">
              {product.localizeInfos?.title}
            </h3>
          </Link>
          <p className="text-gray-400">
            {product.price.toLocaleString("en-IN")}.00
          </p>
          <div className="flex items-center mt-2">
            <Star className="size-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-400">4.5</span>
          </div>
        </div>
        <div className="p-4">
          <Button
          className="w-full bg-customColor hover:bg-[#00CCCC] text-black font-semibold transition-all duration-300 transform group-hover:translate-y-0 translate-y-6"
          onClick={() => handleAddToCart(product)}

          >
            <ShoppingCart className="size-5 mr-2" />
            Add to Cart
          </Button>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-customColor to-[#00CCCC] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
