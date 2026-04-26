import { ArrowLeft } from 'lucide-react';
import { FAQ } from '../FAQ';

export function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>

        <FAQ />

        {/* Additional FAQs */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl mb-8">More Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-3">Assembly Services</h3>
              <p className="text-gray-600 mb-4">
                Professional assembly services are available for an additional fee. Our expert team can assemble your furniture quickly and correctly, so you can start enjoying it right away.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-3">Trade Program</h3>
              <p className="text-gray-600 mb-4">
                Are you an interior designer or decorator? Join our trade program for exclusive pricing, priority service, and dedicated support. Contact us for more information.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-3">Gift Cards</h3>
              <p className="text-gray-600 mb-4">
                Give the gift of choice with a Vivere In Style gift card. Available in various amounts, our gift cards never expire and can be used on any product in our collection.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-3">Product Availability</h3>
              <p className="text-gray-600 mb-4">
                Most items are in stock and ready to ship. If an item is out of stock, you can sign up for restock notifications on the product page, and we'll email you when it's available.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl text-center">
          <h2 className="text-2xl mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to answer any questions you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact-us"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:0424023996"
              className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
            >
              Call 0424 023 996
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
