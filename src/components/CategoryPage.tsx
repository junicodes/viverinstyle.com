import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { Button } from './ui/button';
import { Helmet } from 'react-helmet';

interface CategoryPageProps {
  category: {
    slug: string;
    name: string;
    description: string;
    image: string;
  };
  products: any[];
  onBack: () => void;
  onProductClick: (product: any) => void;
}

export function CategoryPage({ category, products, onBack, onProductClick }: CategoryPageProps) {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, products]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Helmet>
        <title>{category.name} - Vivere In Style | Premium Australian Furniture</title>
        <meta name="description" content={`Shop premium ${category.name.toLowerCase()} at Vivere In Style. ${category.description}`} />
        <meta property="og:title" content={`${category.name} - Vivere In Style`} />
        <meta property="og:description" content={category.description} />
        <link rel="canonical" href={`https://www.vivereinstyle.com/collections/${category.slug}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-4">
                {category.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
          
          <ProductGrid
            products={products}
            onProductClick={onProductClick}
          />

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No products found in this category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}