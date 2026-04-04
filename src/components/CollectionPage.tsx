import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { Button } from './ui/button';
import { Helmet } from 'react-helmet';

interface CollectionPageProps {
  products: any[];
  onBack: () => void;
  onProductClick: (product: any) => void;
}

export function CollectionPage({ products, onBack, onProductClick }: CollectionPageProps) {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  
  useEffect(() => {
    // Scroll to top instantly without animation
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = filter === 'featured' 
    ? products.filter(p => p.featured)
    : products;

  return (
    <>
      <Helmet>
        <title>Complete Furniture Collection - Vivere In Style | Premium Australian Furniture</title>
        <meta name="description" content="Explore our full range of premium Australian-designed furniture. From statement pieces to everyday essentials, find everything you need for your dream home." />
        <link rel="canonical" href="https://www.vivereinstyle.com/collection" />
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 to-gray-700 text-white py-20">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:text-white hover:bg-white/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl mb-6">
                Our Complete Collection
              </h1>
              <p className="text-xl text-white/90">
                Explore our full range of premium Australian-designed furniture. From statement pieces to everyday essentials, find everything you need to create your dream home.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  All Products ({products.length})
                </Button>
                <Button
                  variant={filter === 'featured' ? 'default' : 'outline'}
                  onClick={() => setFilter('featured')}
                  size="sm"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Featured ({products.filter(p => p.featured).length})
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-white dark:bg-black">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGrid
              products={filteredProducts}
              onProductClick={onProductClick}
            />

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">No products found</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl text-center mb-12 text-gray-900 dark:text-white">Why Choose Vivere In Style?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h3 className="text-xl mb-2 text-gray-900 dark:text-white">10-Year Warranty</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every piece comes with our comprehensive 10-year structural warranty for your peace of mind.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  🚚
                </div>
                <h3 className="text-xl mb-2 text-gray-900 dark:text-white">Free Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complimentary delivery across Australia. We'll bring your furniture right to your door.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ↩
                </div>
                <h3 className="text-xl mb-2 text-gray-900 dark:text-white">120-Day Returns</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Not completely satisfied? Return it within 120 days for a full refund, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}