import { motion } from 'motion/react';
import { Truck, Shield, RotateCcw } from 'lucide-react';

export function Features() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary dark:bg-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Truck,
              title: 'Fast Shipping',
              description: 'Express delivery on all orders across Australia',
            },
            {
              icon: Shield,
              title: '10-Year Warranty',
              description: 'All products backed by comprehensive warranty',
            },
            {
              icon: RotateCcw,
              title: '120-Day Returns',
              description: 'Not satisfied? Return within 120 days',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              >
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </motion.div>
              <h3 className="text-lg sm:text-xl mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}