import { ArrowLeft, Home, ShoppingBag, Info, FileText } from 'lucide-react';

export function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>

        <h1 className="text-4xl md:text-5xl mb-6">Sitemap</h1>
        <p className="text-xl text-gray-600 mb-12">
          A complete overview of all pages on Vivere In Style
        </p>

        <div className="bg-blue-50 p-6 rounded-xl mb-12">
          <h3 className="mb-2">💡 What is a Sitemap?</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            A sitemap is a comprehensive list of all the pages on our website. It helps you quickly find what you're looking for and assists search engines in discovering and indexing our content. Think of it as a map or directory of our entire website structure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Pages */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5" />
              <h2 className="text-2xl">Main Pages</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Home
                </a>
              </li>
              <li>
                <a href="/#sofas" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Sofas & Couches
                </a>
              </li>
              <li>
                <a href="/#chairs" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Chairs
                </a>
              </li>
              <li>
                <a href="/#tables" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Tables
                </a>
              </li>
              <li>
                <a href="/#beds" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Beds & Bedroom
                </a>
              </li>
              <li>
                <a href="/#storage" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Storage
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5" />
              <h2 className="text-2xl">Customer Service</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/brand-story" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Our Story
                </a>
              </li>
              <li>
                <a href="/contact-us" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="/shipping-delivery" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="/returns-refunds" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/warranty" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Warranty Information
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              <h2 className="text-2xl">Legal & Policies</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-conditions" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/sitemap" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-2xl">Shopping</h2>
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/#featured" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Featured Collection
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → New Arrivals
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  → Sale Items
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl">
          <h2 className="text-2xl mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-6">
            If you can't find the page you're looking for, please use our search feature or contact our customer service team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/contact-us"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              Contact Us
            </a>
            <a
              href="/faq"
              className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors text-center"
            >
              View FAQs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}