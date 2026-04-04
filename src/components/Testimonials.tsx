import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const DEFAULT_TESTIMONIALS = [
  { id: '1', name: 'Sarah Thompson', location: 'Sydney, NSW', rating: 5, text: 'Absolutely love my new Cloud Modern Sofa! The quality is exceptional and it transformed my living room. The delivery was seamless and the 10-year warranty gives me peace of mind.', product: 'Cloud Modern Sofa', date: 'October 2024' },
  { id: '2', name: 'Michael Chen', location: 'Melbourne, VIC', rating: 5, text: 'Best furniture shopping experience ever! The team was incredibly helpful with customization options. My Oak Dining Table is the centerpiece of our home now.', product: 'Oak Dining Table', date: 'September 2024' },
  { id: '3', name: 'Emma Wilson', location: 'Brisbane, QLD', rating: 5, text: 'The quality exceeded my expectations! Fast delivery, easy assembly, and the furniture looks even better in person. Highly recommend Vivere In Style to everyone.', product: 'Nordic Dining Chair', date: 'November 2024' },
  { id: '4', name: 'James Anderson', location: 'Perth, WA', rating: 5, text: 'Outstanding customer service and premium quality furniture. The 120-day return policy made the decision easy. Could not be happier with my purchase!', product: 'Luxe Upholstered Bed', date: 'August 2024' },
  { id: '5', name: 'Sophie Martinez', location: 'Adelaide, SA', rating: 5, text: "From browsing to delivery, everything was perfect. The furniture is beautifully designed and built to last. Love that it's Australian-designed!", product: 'L-Shaped Sectional Sofa', date: 'October 2024' },
  { id: '6', name: 'David Park', location: 'Canberra, ACT', rating: 5, text: 'Exceptional quality and style! The customization options allowed me to get exactly what I wanted. Free delivery to Canberra was a huge bonus.', product: 'Velvet Accent Chair', date: 'September 2024' },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/testimonials`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then(r => r.json())
      .then(data => { if (data.testimonials?.length > 0) setTestimonials(data.testimonials); })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const avgRating = (testimonials.reduce((sum: number, t: any) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-gray-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Real reviews from real customers across Australia
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{avgRating} out of 5 stars</span>
          </div>
        </motion.div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial: any, index: number) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="bg-gray-50 dark:bg-black dark:border dark:border-gray-700 rounded-2xl p-8 h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Quote className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-4" />
                    
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_: any, i: number) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="mb-2">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.product}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 dark:text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{testimonial.date}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
