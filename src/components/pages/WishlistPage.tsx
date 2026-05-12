import { useEffect, useState } from 'react';
import { Heart, ArrowLeft, ShoppingCart, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useStore } from '../../store/useStore';
import { api } from '../../utils/api';
import { Helmet } from 'react-helmet';
import { isProductInStock } from '../SEO';
import { toast } from 'sonner@2.0.3';
import { cn } from '../ui/utils';

interface WishlistPageProps {
  onBack: () => void;
  onProductClick: (product: any) => void;
}

export function WishlistPage({ onBack, onProductClick }: WishlistPageProps) {
  const { favorites, toggleFavorite, addToCart, setCartOpen, isLineInCart } = useStore();
  const [addedFlashId, setAddedFlashId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadFavorites = async () => {
      try {
        const allProducts = await api.getProducts();
        const favoriteProducts = allProducts.filter((p: any) => favorites.includes(p.id));
        setProducts(favoriteProducts);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [favorites]);

  const handleAddToCart = (product: any) => {
    if (!isProductInStock(product) || isLineInCart(product.id)) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1,
    });
    setAddedFlashId(product.id);
    window.setTimeout(() => setAddedFlashId((id) => (id === product.id ? null : id)), 1200);
    toast.success(`${product.name} added to cart!`, {
      action: { label: 'View Cart', onClick: () => setCartOpen(true) },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Helmet>
        <title>Wishlist - Vivere In Style</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-2">Your Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">{products.length} {products.length === 1 ? 'item' : 'items'} saved</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Loading your wishlist...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Browse our collection and tap the heart icon to save items you love.</p>
            <Button onClick={onBack}>Browse Collection</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const inStock = isProductInStock(product);
              const inCart = isLineInCart(product.id);
              return (
                <div key={product.id} className="group bg-white dark:bg-black dark:border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <button onClick={() => onProductClick(product)} className="w-full text-left">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {!inStock && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-gray-900 text-white text-xs rounded-full">
                          Pre-order
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="p-4">
                    <button onClick={() => onProductClick(product)} className="text-left w-full">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">{product.category}</p>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">${product.price?.toLocaleString()}</p>
                    </button>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className={cn(
                          'flex-1 transition-all duration-200',
                          'hover:brightness-105 hover:ring-2 hover:ring-gray-900 dark:hover:ring-gray-100',
                          addedFlashId === product.id && 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-black scale-[1.02]',
                        )}
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock || inCart}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            In cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            {inStock ? 'Add to Cart' : 'Pre-order'}
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFavorite(product.id)}
                        className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
