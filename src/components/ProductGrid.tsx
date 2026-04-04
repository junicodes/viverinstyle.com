import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useStore } from '../store/useStore';
import { isProductInStock } from './SEO';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stock?: number;
}

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const { addToCart } = useStore();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 }
          }}
          className="group cursor-pointer"
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
          onClick={() => onProductClick?.(product)}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative bg-white dark:bg-black dark:border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
              <motion.img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                animate={{
                  scale: hoveredProduct === product.id ? 1.1 : 1,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!isProductInStock(product) && (
                  <Badge variant="secondary" className="bg-gray-900 text-white text-xs">
                    Pre-order
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                    {calculateDiscount(product.originalPrice, product.price)}% OFF
                  </Badge>
                )}
                {product.featured && isProductInStock(product) && !product.originalPrice && (
                  <Badge variant="secondary" className="bg-brand-taupe text-white text-xs">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: hoveredProduct === product.id ? 1 : 0,
                  y: hoveredProduct === product.id ? 0 : 20,
                }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-4 right-4 flex gap-2"
              >
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={!isProductInStock(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick?.(product);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-1 capitalize">{product.category}</div>
              <h3 className="text-lg mb-2 line-clamp-1">{product.name}</h3>

              {/* Rating */}
              {product.rating !== undefined && product.reviews !== undefined && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">${product.price?.toLocaleString() || '0'}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}