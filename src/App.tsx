import { SEO } from './components/SEO';
import { api } from './utils/api';
import { seedData } from './utils/seedData';
import { TermsConditionsPage } from './components/pages/TermsConditionsPage';
import { BrandStoryPage } from './components/pages/BrandStoryPage';
import { FAQPage } from './components/pages/FAQPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { ShippingDeliveryPage } from './components/pages/ShippingDeliveryPage';
import { ReturnsRefundsPage } from './components/pages/ReturnsRefundsPage';
import { WarrantyPage } from './components/pages/WarrantyPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { SitemapPage } from './components/pages/SitemapPage';
import { BlogPage } from './components/pages/BlogPage';
import { ArrowRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { motion } from 'motion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { toast, Toaster } from 'sonner';
import './styles/globals.css';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { Features } from './components/Features';
import { ProductGrid } from './components/ProductGrid';
import { CustomerPhotos } from './components/CustomerPhotos';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { CategoryPage } from './components/CategoryPage';
import { CollectionPage } from './components/CollectionPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomerAccount from './pages/CustomerAccount';
import { LoadingScreen } from './components/LoadingScreen';
import { OrderDetailPage } from './components/pages/OrderDetailPage';
import { WishlistPage } from './components/pages/WishlistPage';
import { useStore } from './store/useStore';
import { projectId } from './utils/supabase/info';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const { accessToken } = useStore();

  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentPage('home');
      } else {
        setCurrentPage(path.replace(/^\//, ''));
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const { data: allProducts = [], isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });

  useEffect(() => {
    const initializeApp = async () => {
      if (initialized) return;
      
      try {
        const isHealthy = await api.checkHealth();
        
        if (isHealthy) {
          const products = await api.getProducts();
          const cats = await api.getCategories();
          
          if (products.length === 0 || cats.length === 0) {
            const { migration } = await import('./utils/api');
            const hasLocalData = migration.hasLocalData();
            
            if (!hasLocalData) {
              await api.seedDatabase(seedData);
              refetchCategories();
              refetchProducts();
            }
          }
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitialized(true);
      }
    };

    initializeApp();
  }, [initialized]);

  const isLoading = categoriesLoading || productsLoading;

  const productsByCategory = useMemo(() => {
    return allProducts.reduce((acc: any, product: any) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [allProducts]);

  if (isLoading && !initialized) {
    return <LoadingScreen />;
  }

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setCurrentPage('category');
    window.history.pushState({}, '', `/collections/${category.slug}`);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.history.pushState({}, '', `/products/${product.slug || product.id}`);
  };

  const handleCollectionClick = () => {
    setCurrentPage('collection');
    window.history.pushState({}, '', '/collection');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
    window.history.pushState({}, '', '/');
  };

  const handleNavigate = (page: string) => {
    const cleanPage = page.replace(/^\//, '');
    setCurrentPage(cleanPage);
    
    if (cleanPage !== 'category') {
      setSelectedCategory(null);
    }

    if (cleanPage === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${cleanPage}`);
    }
  };

  const commonCategoryClickHandler = (slug: string) => {
    const category = categories.find((c: any) => c.slug === slug);
    if (category) handleCategoryClick(category);
  };

  // Standalone info pages (they include their own Header/Footer)
  if (currentPage === 'terms-conditions') return <TermsConditionsPage />;
  if (currentPage === 'brand-story') return <BrandStoryPage onBack={handleBackToHome} />;
  if (currentPage === 'faq') return <FAQPage />;
  if (currentPage === 'contact-us') return <ContactUsPage />;
  if (currentPage === 'shipping-delivery') return <ShippingDeliveryPage />;
  if (currentPage === 'returns-refunds') return <ReturnsRefundsPage />;
  if (currentPage === 'warranty') return <WarrantyPage />;
  if (currentPage === 'privacy-policy') return <PrivacyPolicyPage />;
  if (currentPage === 'sitemap') return <SitemapPage />;
  if (currentPage === 'blogs') return <BlogPage onNavigate={handleNavigate} />;

  // Wishlist Page
  if (currentPage === 'wishlist') {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={handleProductClick} />
        <Cart />
        <WishlistPage onBack={handleBackToHome} onProductClick={handleProductClick} />
        <Footer onNavigate={handleNavigate} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin Dashboard
  if (currentPage === 'admin') {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={setSelectedProduct} />
        <Cart />
        <AdminDashboard onNavigate={(path, orderId) => {
          if (path === '/orders' && orderId) {
            const loadOrder = async () => {
              try {
                const response = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/orders/${orderId}`,
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                if (response.ok) {
                  const data = await response.json();
                  setSelectedOrder(data.order);
                  setCurrentPage('order-detail');
                }
              } catch (error) {
                toast.error('Failed to load order details');
              }
            };
            loadOrder();
          } else {
            handleNavigate(path);
          }
        }} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Order Detail Page (Admin)
  if (currentPage === 'order-detail' && selectedOrder) {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={setSelectedProduct} />
        <Cart />
        <OrderDetailPage
          order={selectedOrder}
          onBack={() => {
            setSelectedOrder(null);
            setCurrentPage('admin');
          }}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  // Customer Account
  if (currentPage === 'account') {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={setSelectedProduct} />
        <Cart />
        <CustomerAccount />
        <Footer onNavigate={handleNavigate} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Category Page
  if (currentPage === 'category' && selectedCategory) {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={setSelectedProduct} />
        <Cart />
        <CategoryPage
          key={selectedCategory.slug}
          category={selectedCategory}
          products={productsByCategory[selectedCategory.slug] || []}
          onProductClick={handleProductClick}
          onBack={handleBackToHome}
        />
        <Footer onNavigate={handleNavigate} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Collection Page
  if (currentPage === 'collection') {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={setSelectedProduct} />
        <Cart />
        <CollectionPage
          products={allProducts}
          onProductClick={handleProductClick}
          onBack={handleBackToHome}
        />
        <Footer onNavigate={handleNavigate} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Product Detail Page
  if (currentPage === 'product' && selectedProduct) {
    return (
      <>
        <Header onNavigate={handleNavigate} onCategoryClick={commonCategoryClickHandler} onProductClick={setSelectedProduct} />
        <Cart />
        <ProductDetailPage
          product={selectedProduct}
          allProducts={allProducts}
          onBack={() => {
            setSelectedProduct(null);
            handleBackToHome();
          }}
          onProductClick={handleProductClick}
        />
        <Footer onNavigate={handleNavigate} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Handle URL-based product/collection routing
  if (currentPage.startsWith('products/') || currentPage.startsWith('collections/')) {
    const slug = currentPage.split('/')[1];
    if (currentPage.startsWith('products/') && !selectedProduct) {
      const product = allProducts.find((p: any) => p.slug === slug || p.id === slug);
      if (product) {
        setSelectedProduct(product);
        setCurrentPage('product');
        return <LoadingScreen />;
      }
    }
    if (currentPage.startsWith('collections/') && !selectedCategory) {
      const category = categories.find((c: any) => c.slug === slug);
      if (category) {
        setSelectedCategory(category);
        setCurrentPage('category');
        return <LoadingScreen />;
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Vivere In Style - Premium Australian Furniture | vivereinstyle.com</title>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta
          name="description"
          content="Discover premium furniture in Australia at Vivere In Style. Quality sofas, beds, dining sets & home decor delivered across Sydney, Melbourne, Brisbane & beyond. Shop now!"
        />
        <meta
          name="keywords"
          content="furniture Australia, modern furniture, sofas, chairs, tables, beds, storage, Australian design, premium furniture, home decor, vivere in style"
        />
        <meta property="og:title" content="Vivere In Style - Premium Australian Furniture" />
        <meta
          property="og:description"
          content="Discover premium Australian-designed furniture for modern living. Quality craftsmanship meets contemporary style. La dolce vita."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.vivereinstyle.com/" />
        <link rel="canonical" href="https://www.vivereinstyle.com/" />
      </Helmet>
      
      <SEO products={allProducts} />

      <div className="min-h-screen bg-background text-foreground">
        <Header 
          onCategoryClick={commonCategoryClickHandler}
          onProductClick={handleProductClick}
          onNavigate={handleNavigate}
        />
        <Cart />

        <main>
          <HeroCarousel 
            onCategoryClick={commonCategoryClickHandler}
            onBuyNowClick={async (slideData) => {
              const categorySlug = slideData.ctaLink.replace('#', '');
              const categoryProducts = allProducts.filter((p: any) => p.category === categorySlug);
              
              let product = categoryProducts.find((p: any) => 
                p.name.toLowerCase().includes(slideData.productName.toLowerCase().split(' ')[0])
              );
              
              if (!product) {
                product = categoryProducts[0] || allProducts.find((p: any) => p.featured);
              }
              
              if (product) {
                handleProductClick(product);
              }
            }}
          />
          
          {/* New Arrivals */}
          {allProducts.length > 0 && (
            <section className="py-16 bg-background">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl text-foreground">New Arrivals</h2>
                    <p className="text-muted-foreground mt-1">The latest additions to our collection</p>
                  </div>
                  <Button variant="outline" onClick={handleCollectionClick}>
                    View All
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <ProductGrid
                  products={allProducts.slice(-8).reverse()}
                  onProductClick={handleProductClick}
                />
              </div>
            </section>
          )}

          {/* Categories */}
          <section className="py-20 bg-background">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl mb-4">Premium Australian Furniture for Modern Living</h1>
                <p className="text-xl text-muted-foreground">
                  Explore our curated collections
                </p>
              </motion.div>
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
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
                {categories.map((category: any) => (
                  <motion.button
                    key={category.slug}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 }
                    }}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative overflow-hidden rounded-2xl aspect-square hover:shadow-2xl transition-all duration-300"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <div className="text-white text-left">
                        <h3 className="text-lg mb-1">{category.name}</h3>
                        <p className="text-sm text-white/80 group-hover:text-white transition-colors">
                          View All →
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </section>

          <Features />

          {/* Featured Products */}
          {allProducts.length > 0 && (
            <section className="py-20 bg-gray-50 dark:bg-black">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">Featured Collection</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Hand-picked pieces from our latest collection
                  </p>
                </div>
                <ProductGrid
                  products={allProducts.filter((p: any) => p.featured).slice(0, 8)}
                  onProductClick={handleProductClick}
                />
                <div className="text-center mt-12">
                  <Button size="lg" onClick={handleCollectionClick}>
                    View Complete Collection
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </section>
          )}

          <CustomerPhotos />
          <Testimonials />
          <FAQ />

          {/* Products by Category */}
          {categories.map((category: any) => {
            const categoryProducts = productsByCategory[category.slug] || [];
            
            if (categoryProducts.length === 0) return null;

            return (
              <section
                key={category.slug}
                id={category.slug}
                className="py-20 bg-gray-50 dark:bg-black"
              >
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-12 flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl md:text-5xl mb-4">{category.name}</h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400">{category.description}</p>
                    </div>
                  </div>
                  <ProductGrid
                    products={categoryProducts.slice(0, 8)}
                    onProductClick={handleProductClick}
                  />
                  {categoryProducts.length > 8 && (
                    <div className="text-center mt-12">
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => handleCategoryClick(category)}
                      >
                        Show More {category.name}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            );
          })}

          {/* Newsletter */}
          <section className="py-20 bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl mb-4">Stay in the Loop</h2>
              <p className="text-xl text-gray-300 mb-8">
                Get exclusive deals, new arrivals, and design inspiration delivered to your inbox
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  
                  const subscribers = JSON.parse(localStorage.getItem('vivere-newsletter-subscribers') || '[]');
                  if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('vivere-newsletter-subscribers', JSON.stringify(subscribers));
                    toast.success('Successfully subscribed to our newsletter!');
                    e.currentTarget.reset();
                  } else {
                    toast.info('You are already subscribed!');
                  }
                }}
                className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 bg-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-gray-400 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </section>
        </main>

        <Footer onNavigate={handleNavigate} />
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
