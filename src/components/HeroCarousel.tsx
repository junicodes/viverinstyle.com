import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Hero3DAnimation } from './Hero3DAnimation';

const heroSlides = [
  {
    id: 1,
    title: 'Live in Style,\nLive in Comfort',
    description: 'Discover premium Australian-designed furniture that transforms your space into a sanctuary of style and comfort.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    productName: 'Cloud Modern Sofa',
    cta: 'Shop Sofas',
    ctaLink: '#sofas',
  },
  {
    id: 2,
    title: 'Dining in\nElegance',
    description: 'Handcrafted tables that bring families together. Where style meets functionality for memorable dining experiences.',
    image: 'https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=1200&q=80',
    productName: 'Oak Dining Table',
    cta: 'Shop Tables',
    ctaLink: '#tables',
  },
  {
    id: 3,
    title: 'Sleep in\nLuxury',
    description: 'Transform your bedroom into a five-star retreat with our luxurious upholstered beds and bedroom furniture.',
    image: 'https://images.unsplash.com/photo-1583221742001-9ad88bf233ff?w=1200&q=80',
    productName: 'Luxe Upholstered Bed',
    cta: 'Shop Beds',
    ctaLink: '#beds',
  },
  {
    id: 4,
    title: 'Scandinavian\nSimplicity',
    description: 'Nordic-inspired design that brings warmth and elegance to your dining space. Timeless style, everyday comfort.',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&q=80',
    productName: 'Nordic Dining Chair',
    cta: 'Shop Chairs',
    ctaLink: '#chairs',
  },
  {
    id: 5,
    title: 'Work in\nStyle',
    description: 'Create your perfect workspace with furniture designed for productivity and inspiration. Work from home in comfort.',
    image: 'https://images.unsplash.com/photo-1700451761308-ec56f93c82be?w=1200&q=80',
    productName: 'Modern Desk Collection',
    cta: 'Shop Now',
    ctaLink: '#featured',
  },
  {
    id: 6,
    title: 'Organized\nLiving',
    description: 'Smart storage solutions that keep your space tidy and beautiful. Function meets design in perfect harmony.',
    image: 'https://images.unsplash.com/photo-1595515106864-077d30192c56?w=1200&q=80',
    productName: 'Modern Storage',
    cta: 'Shop Storage',
    ctaLink: '#storage',
  },
  {
    id: 7,
    title: 'Velvet\nLuxury',
    description: 'Add a touch of sophistication with our velvet accent chairs. Perfect for reading nooks and cozy corners.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80',
    productName: 'Velvet Accent Chair',
    cta: 'Shop Chairs',
    ctaLink: '#chairs',
  },
  {
    id: 8,
    title: 'Sectional\nComfort',
    description: 'Spacious sectionals perfect for family gatherings. Modular design adapts to your living space needs.',
    image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1200&q=80',
    productName: 'L-Shaped Sectional',
    cta: 'Shop Sofas',
    ctaLink: '#sofas',
  },
  {
    id: 9,
    title: 'Modern\nElegance',
    description: 'Contemporary coffee tables that serve as the centerpiece of your living room. Style that speaks volumes.',
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=1200&q=80',
    productName: 'Marble Coffee Table',
    cta: 'Shop Tables',
    ctaLink: '#tables',
  },
  {
    id: 10,
    title: 'Complete\nYour Space',
    description: 'Browse our full collection of Australian-designed furniture. Quality craftsmanship for every room in your home.',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80',
    productName: 'Complete Collection',
    cta: 'View All',
    ctaLink: '#featured',
  },
];

interface HeroCarouselProps {
  onCategoryClick?: (categorySlug: string) => void;
  onBuyNowClick?: (slideData: any) => void;
}

export function HeroCarousel({ onCategoryClick, onBuyNowClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000); // Slower transition - 7 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  const handleBuyNow = () => {
    if (onBuyNowClick) {
      onBuyNowClick(slide);
    }
  };

  const handleCategoryClick = (link: string) => {
    // Extract category slug from the link (#sofas -> sofas)
    const categorySlug = link.replace('#', '');
    if (onCategoryClick) {
      onCategoryClick(categorySlug);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-black overflow-hidden h-[500px] sm:h-[600px] md:h-[700px]">
      {/* 3D Animation Background */}
      <Hero3DAnimation />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center h-full py-8 sm:py-12">
          {/* Left Content - Fade animation */}
          <div className="space-y-4 sm:space-y-6 z-10">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs sm:text-sm font-medium">
              New Collection 2025
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold whitespace-pre-line text-gray-900 dark:text-white">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mt-4 sm:mt-6">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button size="default" className="group text-sm sm:text-base" onClick={handleBuyNow}>
                Buy Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="default"
                variant="outline"
                className="text-sm sm:text-base"
                onClick={() => handleCategoryClick(slide.ctaLink)}
              >
                {slide.cta}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-lg sm:text-2xl">✓</span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Express Shipping</div>
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Australia Wide</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-lg sm:text-2xl">✓</span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">120-Day Returns</div>
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Risk Free</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image - Fade animation with bounce preserved */}
          <div className="relative h-full flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="relative rounded-3xl overflow-hidden shadow-2xl w-full h-[400px] md:h-[500px]"
              >
                <motion.img
                  src={slide.image}
                  alt={slide.productName}
                  className="w-full h-full object-cover"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 text-white">
                  <p className="text-xs sm:text-sm opacity-90">Featured Product</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{slide.productName}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating card - Not affected by slide animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hidden md:block"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Express Shipping</div>
                  <div className="font-medium text-gray-900 dark:text-white">Australia Wide</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-gray-900 dark:bg-white w-8' : 'bg-gray-400 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-100 dark:from-black to-transparent rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-100 dark:from-black to-transparent rounded-full blur-3xl opacity-50 -z-10" />
    </section>
  );
}