import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Check, User } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { useStore } from '../../store/useStore';
import { Textarea } from '../ui/textarea';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { isProductInStock } from '../SEO';
import { Helmet } from 'react-helmet';

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verified: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features?: string[];
  specifications?: Record<string, string>;
}

interface ProductDetailPageProps {
  product: Product;
  allProducts?: any[];
  onBack: () => void;
  onProductClick?: (product: any) => void;
}

export function ProductDetailPage({ product, allProducts = [], onBack, onProductClick }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { toggleFavorite, isFavorite, addToCart, setCartOpen, user } = useStore();
  const favorite = isFavorite(product.id);

  const images = product.images || [product.image];

  useEffect(() => {
    // Scroll to top instantly without animation
    window.scrollTo(0, 0);
    loadReviews();
  }, [product.id]);

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/products/${product.id}/reviews`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity,
    });
    toast.success(`${quantity} × ${product.name} added to cart! 🛒`, {
      action: {
        label: 'View Cart',
        onClick: () => setCartOpen(true),
      },
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast.success(favorite ? 'Removed from favorites' : 'Added to favorites ❤️');
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (!newReview.title || !newReview.comment) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/products/${product.id}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name || user.email.split('@')[0],
            ...newReview,
          }),
        }
      );

      if (response.ok) {
        toast.success('Review submitted successfully! 🎉');
        setNewReview({ rating: 5, title: '', comment: '' });
        loadReviews();
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const relatedProducts = allProducts
    .filter((p: any) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const inStock = isProductInStock(product);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Helmet>
        <title>{product.name} - Vivere In Style | Premium Australian Furniture</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
        <meta property="og:title" content={`${product.name} - Vivere In Style`} />
        <meta property="og:description" content={product.description?.slice(0, 160)} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.vivereinstyle.com/products/${product.slug || product.id}`} />
        {images[0] && <meta property="og:image" content={images[0]} />}
        <link rel="canonical" href={`https://www.vivereinstyle.com/products/${product.slug || product.id}`} />
      </Helmet>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-black dark:border-white'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">{product.category}</p>
            <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating !== undefined && product.reviews !== undefined && (
              <div className="flex items-center gap-3 mb-6">
                {renderStars(product.rating, 'lg')}
                <span className="text-lg text-gray-900 dark:text-white font-semibold">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                ${product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  -
                </Button>
                <span className="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!isProductInStock(product)}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">{isProductInStock(product) ? 'Add to Cart' : 'Out of Stock'}</span>
                <span className="sm:hidden">{isProductInStock(product) ? 'Add' : 'Out of Stock'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                className="h-12 sm:h-14 px-4 sm:px-6 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${favorite ? 'fill-red-500 text-red-500' : 'dark:text-gray-400'}`}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-center">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-900 dark:text-white" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Fast Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-900 dark:text-white" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">10-Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-900 dark:text-white" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">120-Day Returns</p>
              </div>
            </div>

            {/* Product Features */}
            {product.features && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>

          {/* Review Summary */}
          {product.rating !== undefined && product.reviews !== undefined && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.rating.toFixed(1)}
                  </p>
                  {renderStars(product.rating, 'lg')}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Based on {product.reviews} reviews
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Add Review (Logged In Only) */}
          {user && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Write a Review</h3>
              
              {/* Rating Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Sum up your experience"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                />
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your Review
                </label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this product"
                  rows={4}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          )}

          {/* Guest Message */}
          {!user && (
            <div className="bg-blue-50 dark:bg-black border border-blue-200 dark:border-gray-700 rounded-xl p-6 mb-8">
              <p className="text-blue-900 dark:text-blue-200">
                <strong>Want to leave a review?</strong> Please sign in to share your experience with this product.
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                        {review.verified && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related: any) => (
                <button
                  key={related.id}
                  onClick={() => onProductClick?.(related)}
                  className="group text-left"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                    <img
                      src={related.images?.[0] || related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{related.name}</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    ${related.price?.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}