import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const DEFAULT_PHOTOS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1669936785255-4a75c8135872?w=800&q=80', name: 'Sarah & Mike', location: 'Sydney, NSW' },
  { id: '2', image: 'https://images.unsplash.com/photo-1758518727193-a8da31447858?w=800&q=80', name: 'Emma Johnson', location: 'Melbourne, VIC' },
  { id: '3', image: 'https://images.unsplash.com/photo-1549413947-4757a901a36a?w=800&q=80', name: 'Jessica Lee', location: 'Brisbane, QLD' },
  { id: '4', image: 'https://images.unsplash.com/photo-1752876761219-ef91275a142a?w=800&q=80', name: 'David Chen', location: 'Perth, WA' },
  { id: '5', image: 'https://images.unsplash.com/photo-1520453714493-d85cdd7b033b?w=800&q=80', name: 'Tom & Lisa', location: 'Adelaide, SA' },
  { id: '6', image: 'https://images.unsplash.com/photo-1606787366502-801098a5eca5?w=800&q=80', name: 'The Smith Family', location: 'Canberra, ACT' },
];

export function CustomerPhotos() {
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/customer-photos`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then(r => r.json())
      .then(data => { if (data.photos?.length > 0) setPhotos(data.photos); })
      .catch(() => {});
  }, []);

  if (photos.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-gray-900 dark:text-white">Happy Customers</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers across Australia
          </p>
        </motion.div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {photos.map((customer: any, index: number) => (
              <CarouselItem key={customer.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={customer.image}
                      alt={`${customer.name} - Happy customer`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl mb-1">{customer.name}</h3>
                    <p className="text-sm text-gray-200">{customer.location}</p>
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
