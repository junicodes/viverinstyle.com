import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What are your delivery options?',
    answer: 'We offer express delivery across all of Australia. For orders over $500, delivery is complimentary. For orders under $500, a flat delivery fee of $99 applies. Delivery times vary by location, typically 5-14 business days.',
  },
  {
    question: 'What is your return policy?',
    answer: '120-day trial period on all furniture. If you\'re not completely satisfied, return it for a full refund. Items must be in original condition. Return shipping costs apply for change of mind returns.',
  },
  {
    question: 'Do you provide warranty on your furniture?',
    answer: 'All our furniture comes with a comprehensive 10-year structural warranty. This covers manufacturing defects and structural issues. Normal wear and tear is not covered. Extended warranty options are available at checkout.',
  },
  {
    question: 'Can I customize my furniture?',
    answer: 'Absolutely! Most of our furniture pieces can be customized. You can choose from different colors, materials, and sometimes even dimensions. Look for the "Customizable" badge on product pages to see which items can be personalized.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery times vary based on your location and whether the item is in stock. In-stock items typically arrive within 5-14 business days. Custom orders may take 6-8 weeks. You\'ll receive tracking information once your order ships.',
  },
  {
    question: 'Do you have a showroom I can visit?',
    answer: 'Yes! Our Adelaide showroom is located at 123 Furniture Lane, Adelaide SA 5000. We\'re open Monday-Friday 9am-6pm, Saturday 10am-5pm, and Sunday 11am-4pm. Come experience our furniture in person!',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Afterpay. For orders over $1,000, we also offer flexible payment plans with zero interest.',
  },
  {
    question: 'How do I care for my furniture?',
    answer: 'Each piece comes with specific care instructions. Generally, we recommend regular dusting, avoiding direct sunlight, and using appropriate cleaning products for your furniture\'s material. Detailed care guides are included with every purchase.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
            Everything you need to know about Vivere In Style
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-black dark:border dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-white pr-4 sm:pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
          <a
            href="/faq"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All FAQs
          </a>
        </div>
      </div>
    </section>
  );
}