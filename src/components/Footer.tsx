import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import logoImage from 'figma:asset/1bbddcaa197198eb93aced0c28b77cec28693e0a.png';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path.replace(/^\//, ''));
    } else {
      window.location.href = path;
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img 
                  src={logoImage} 
                  alt="Vivere In Style" 
                  className="h-14 w-auto"
                />
              </div>
              <div>
                <div className="text-xl leading-none mb-1">Vivere In Style</div>
                <div className="text-xs text-gray-400 italic">La dolce vita</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Premium Australian-designed furniture for modern living. Quality craftsmanship meets contemporary style.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/vivereinstyle"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/vivereinstyle"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://pinterest.com/vivereinstyle"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
              <a
                href="https://tiktok.com/@vivereinstyle"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.19 8.19 0 004.77 1.53V6.81a4.84 4.84 0 01-1-.12z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <a href="#sofas" className="text-gray-400 hover:text-white transition-colors">
                  Sofas & Couches
                </a>
              </li>
              <li>
                <a href="#chairs" className="text-gray-400 hover:text-white transition-colors">
                  Chairs
                </a>
              </li>
              <li>
                <a href="#tables" className="text-gray-400 hover:text-white transition-colors">
                  Tables
                </a>
              </li>
              <li>
                <a href="#beds" className="text-gray-400 hover:text-white transition-colors">
                  Beds & Bedroom
                </a>
              </li>
              <li>
                <a href="#storage" className="text-gray-400 hover:text-white transition-colors">
                  Storage
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNavigate('/brand-story')} className="text-gray-400 hover:text-white transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('/contact-us')} className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('/shipping-delivery')} className="text-gray-400 hover:text-white transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('/returns-refunds')} className="text-gray-400 hover:text-white transition-colors">
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('/warranty')} className="text-gray-400 hover:text-white transition-colors">
                  Warranty
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('/faq')} className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('/blogs')} className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  <div>123 Furniture Lane</div>
                  <div>Adelaide SA 5000</div>
                  <div>Australia</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a href="tel:1300123456" className="text-gray-400 hover:text-white transition-colors">
                  1300 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:hello@vivereinstyle.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  hello@vivereinstyle.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-gray-800 dark:bg-black dark:border dark:border-gray-700 rounded-lg">
              <div className="text-sm mb-2">Store Hours</div>
              <div className="text-xs text-gray-400">
                <div>Mon - Fri: 9:00 AM - 6:00 PM</div>
                <div>Sat: 10:00 AM - 5:00 PM</div>
                <div>Sun: 11:00 AM - 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Vivere In Style. All rights reserved. | ABN: 12 345 678 901
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => handleNavigate('/privacy-policy')} className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => handleNavigate('/terms-conditions')} className="text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </button>
              <button onClick={() => handleNavigate('/sitemap')} className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}