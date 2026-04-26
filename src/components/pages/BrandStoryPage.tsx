import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Heart, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface BrandStoryPageProps {
  onBack?: () => void;
}

export function BrandStoryPage({ onBack }: BrandStoryPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
            alt="Elegant living space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:text-white hover:bg-white/20 mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6"
            >
              <span className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-4 block">Our Philosophy</span>
              <h1 className="text-5xl md:text-7xl text-white mb-6">
                La Dolce Vita
              </h1>
              <p className="text-xl md:text-2xl text-white/90 italic">
                The art of living beautifully
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Opening Statement */}
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white leading-relaxed">
                Vivere was created from a simple belief —
              </h2>
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 italic">
                that the way we live shapes the way we feel.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <Sparkles className="w-6 h-6 text-amber-400 mx-4" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 text-lg md:text-xl leading-relaxed">
              <p className="text-gray-700 dark:text-gray-300">
                Inspired by the <span className="italic text-gray-900 dark:text-white">elegance of Italian design</span> and the calm beauty of minimal spaces, Vivere brings together timeless pieces that elevate everyday living.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Rooted in the philosophy of <span className="italic font-medium text-gray-900 dark:text-white">La Dolce Vita</span> — "the sweet life" — Vivere blends <span className="text-gray-900 dark:text-white">luxury materials</span>, <span className="text-gray-900 dark:text-white">refined craftsmanship</span>, and <span className="text-gray-900 dark:text-white">effortless style</span>. Every piece is curated with intention, focusing on harmony, texture, and the feeling of coming home to something beautiful.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                From imported stone pieces to handcrafted décor, Vivere isn't just a furniture brand — it's a <span className="italic text-gray-900 dark:text-white">lifestyle</span>. A celebration of slow living, quiet luxury, and the art of creating spaces that speak without saying a word.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <Heart className="w-6 h-6 text-amber-400 mx-4 fill-amber-400" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>

            {/* Closing Statement */}
            <div className="text-center space-y-6 py-12">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300">
                Vivere is for the modern individual who values <span className="text-gray-900 dark:text-white">quality</span>, <span className="text-gray-900 dark:text-white">beauty</span>, and a life lived in style.
              </p>
              
              <div className="space-y-3 pt-8">
                <p className="text-2xl md:text-3xl text-gray-900 dark:text-white">
                  Live beautifully. Live intentionally.
                </p>
                <p className="text-3xl md:text-4xl text-amber-600 dark:text-amber-400 italic">
                  Vivere in Style — La Dolce Vita.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-center mb-16 text-gray-900 dark:text-white"
          >
            Our Philosophy
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Sparkles,
                title: "Quiet Luxury",
                description: "Understated elegance that speaks volumes. We believe true luxury doesn't shout—it whispers through quality materials, impeccable craftsmanship, and timeless design."
              },
              {
                icon: Heart,
                title: "Intentional Living",
                description: "Every piece in your home should serve a purpose and spark joy. We curate furniture that transforms houses into sanctuaries, spaces into experiences."
              },
              {
                icon: Home,
                title: "Slow Living",
                description: "In a world that rushes, we celebrate the art of taking time. Our pieces are designed to be cherished for generations, not seasons."
              }
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-amber-400 dark:bg-amber-500 rounded-full flex items-center justify-center">
                    <pillar.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl text-gray-900 dark:text-white">{pillar.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <img
                src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80"
                alt="Luxury living room"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80"
                alt="Elegant dining space"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8 md:pt-24"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                alt="Minimalist bedroom"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Modern interior detail"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white">
              Begin Your Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover our curated collection of timeless pieces, designed to transform your space into a sanctuary of style and comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => window.location.href = '/'}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Explore Our Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/contact-us'}
              >
                Visit Our Showroom
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
