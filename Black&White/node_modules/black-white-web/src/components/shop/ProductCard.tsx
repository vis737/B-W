import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  base_price: number;
  images: { url: string; alt_text: string }[];
  slug: string;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative aspect-[3/4] overflow-hidden bg-gray-100"
      >
        <img
          src={product.images[0].url}
          alt={product.images[0].alt_text}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-sm font-sans uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-light text-gray-500">${product.base_price.toFixed(2)}</p>
      </div>
    </Link>
  );
};
