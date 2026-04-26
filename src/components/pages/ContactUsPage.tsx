import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

const CONTACT_REASONS = [
  'General Enquiry',
  'Book a Showroom Visit',
  'Product Enquiry',
  'Order Support',
  'Returns / Warranty',
  'Trade / Wholesale',
];

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('reason') === 'showroom' ? 'Book a Showroom Visit' : '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>

        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Contact Us</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            We're here to help! Reach out and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="subject">Reason for Contact *</Label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-2 flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="">Select a reason...</option>
                  {CONTACT_REASONS.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2">Visit Our Showroom</h3>
                    <p className="text-gray-600">
                      8/105 O'Sullivan Road<br />
                      Lonsdale SA 5160<br />
                      Australia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2">Call Us</h3>
                    <p className="text-gray-600">
                      <a href="tel:0424023996" className="hover:text-gray-900">
                        0424 023 996
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2">Email Us</h3>
                    <p className="text-gray-600">
                      <a href="mailto:hello@vivereinstyle.com" className="hover:text-gray-900">
                        hello@vivereinstyle.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="mb-2">Showroom Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 5:00 PM<br />
                      Sunday: 11:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showroom Appointment Card */}
            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">Showroom Visits — By Appointment Only</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Our pieces are stored in a private showroom space in Lonsdale. To maintain a tailored experience, we host viewings by appointment only.
              </p>
              <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mb-4">
                <p>📍 8/105 O'Sullivan Road, Lonsdale SA 5160</p>
                <p>📞 <a href="tel:0424023996" className="underline">0424 023 996</a></p>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Select "Book a Showroom Visit" in the form to request an appointment.
              </p>
            </div>

            {/* Quick Links */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h3 className="mb-4">Need Quick Answers?</h3>
              <div className="space-y-3">
                <a href="/faq" className="block text-gray-600 hover:text-gray-900 transition-colors">
                  → Frequently Asked Questions
                </a>
                <a href="/shipping-delivery" className="block text-gray-600 hover:text-gray-900 transition-colors">
                  → Shipping & Delivery Info
                </a>
                <a href="/returns-refunds" className="block text-gray-600 hover:text-gray-900 transition-colors">
                  → Returns & Refunds Policy
                </a>
                <a href="/warranty" className="block text-gray-600 hover:text-gray-900 transition-colors">
                  → Warranty Information
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              <p className="text-gray-500">Map of Adelaide Showroom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
