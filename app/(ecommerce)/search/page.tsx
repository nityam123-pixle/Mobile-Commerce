"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IProductEntity } from "oneentry/dist/products/productsInterfaces";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import { searchProductAction } from "@/actions/catalog/searchProducts";
import ProductCard from "@/components/productCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<IProductEntity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const params = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 400000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const urlSearchTerm = params.get("searchTerm");

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.attributeSetIdentifier))
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.attributeValues.p_title.value
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        product.price > priceRange[0] && product.price <= priceRange[1];
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.attributeSetIdentifier);

        return matchesSearch && matchesPrice && matchesCategory;

    });
  }, [searchTerm, priceRange, selectedCategories, products]);

  useEffect(() => {
    const searchProducts = async () => {
      if (urlSearchTerm) {
        setIsLoading(true);
        const data = await searchProductAction(urlSearchTerm);
        setProducts(data);
        setIsLoading(false);
      }
    };
    searchProducts();
  }, [urlSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-800 hover:bg-gray-700 text-customColor"
          >
            <Filter className="size-5 mr-2" />
            Filters
          </Button>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-8">
          <AnimatePresence>
            {
                showFilters && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="w-full lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-customColor">Filters</h2>
                            <Button
                                onClick={() => setShowFilters(false)}
                                // variant={"ghost"}
                                size={"icon"}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="size-5" />
                            </Button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label className="text-lg text-gray-300">
                                    Search
                                </Label>
                                <div className="relative mt-2">
                                    <Input 
                                        id="search"
                                        type="text"
                                        placeholder="Search for products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-gray-700 border-gray-700 text-white placeholder-gray-400"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div>
                            <Label className="text-lg text-gray-300">
                                    Price Range
                                </Label>
                                <Slider 
                                    min={0}
                                    max={400000}
                                    step={1}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="mt-2"
                                />
                                <div className="flex justify-between mt-2 text-sm text-gray-400">
                                    <span>{priceRange[0]} ₹</span>
                                    <span>{priceRange[1]} ₹</span>
                                </div>
                            </div>
                            <div>
                            <Label className="text-lg text-gray-300">
                                    Categories
                                </Label>
                                <div className="space-y-2 mt-2">
                                {categories.map((category) => (
                                    <div className="flex items-center" key={category}>
                                        <Checkbox 
                                            id={category}
                                            checked={selectedCategories.includes(category)}
                                            onCheckedChange={(checked) => {
                                                setSelectedCategories(
                                                    checked
                                                    ? [...selectedCategories, category]
                                                    : selectedCategories.filter(
                                                        (c) => c !== category)
                                                )
                                            }}
                                        />
                                        <label
                                            htmlFor={category}
                                            className="ml-2 text-gray-400"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
          </AnimatePresence>

          <LayoutGroup>
            <motion.div
              className={`w-full ${showFilters ? "lg:w-3/4" : ""}`}
              layout
              transition={{ type: "spring", bounce: 0.2, duration: 0 / 6 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                  >
                    {[...Array(8)].map((_, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
                        layout
                      >
                        <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-${
                      showFilters ? "3" : "4"
                    } gap-6`}
                  >
                    <AnimatePresence>
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ProductCard product={product}></ProductCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
