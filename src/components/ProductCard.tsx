import { motion } from 'motion/react';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { useStore } from '../store/useStore';
import { cn } from './ui/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleFavorite, isFavorite, addToCart, setCartOpen, isLineInCart } = useStore();
  const favorite = isFavorite(product.id);
  const inCart = isLineInCart(product.id);
  const [justAdded, setJustAdded] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(favorite ? 'Removed from favorites' : 'Added to favorites ❤️');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || inCart) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
    toast.success(`${product.name} added to cart! 🛒`, {
      action: {
        label: 'View Cart',
        onClick: () => setCartOpen(true),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative bg-white dark:bg-black dark:border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <motion.img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Favorite button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || favorite ? 1 : 0 }}
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition z-10"
          >
            <Heart
              className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
            />
          </motion.button>

          {/* Stock badge */}
          {!product.inStock && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </div>
          )}

          {/* Quick view overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <div className="flex gap-3">
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: isHovered ? 1 : 0.8 }}
                className="bg-white dark:bg-gray-800 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                Quick View
              </motion.button>
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: isHovered ? 1 : 0.8 }}
                className={cn(
                  'p-3 rounded-lg transition-all duration-300',
                  inCart
                    ? 'bg-emerald-800 text-white cursor-not-allowed opacity-90'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:ring-2 hover:ring-white/90 hover:shadow-lg active:scale-95',
                  justAdded && 'ring-4 ring-emerald-300 scale-110',
                  !product.inStock && 'opacity-50 cursor-not-allowed hover:ring-0 hover:scale-100',
                )}
                onClick={handleAddToCart}
                disabled={!product.inStock || inCart}
                title={inCart ? 'Already in cart' : 'Add to cart'}
              >
                {inCart ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <ShoppingCart className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Product info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">{product.category}</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition">
                {product.name}
              </h3>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating !== undefined && product.reviews !== undefined && (
            <div className="flex items-center space-x-1 mb-3">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toLocaleString()}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}