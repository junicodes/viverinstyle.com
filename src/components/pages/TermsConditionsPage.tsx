import { ArrowLeft } from 'lucide-react';

export function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>

        <h1 className="text-4xl md:text-5xl mb-6">Terms & Conditions</h1>
        <p className="text-gray-600 mb-12">Last updated: November 10, 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using Vivere In Style's website (vivereinstyle.com), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">2. Use of Website</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may use our website only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Use the site in any way that violates any applicable law or regulation</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use of the site</li>
              <li>Attempt to interfere with the proper working of the site</li>
              <li>Use any robot, spider, or scraping tool to access the site</li>
              <li>Introduce any viruses, trojan horses, or other harmful material</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">3. Product Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We make every effort to display the colors and images of our products as accurately as possible. However, we cannot guarantee that your device's display of colors accurately reflects the actual product colors. All dimensions and specifications are approximate and may vary slightly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">4. Pricing and Availability</h2>
            <p className="text-gray-600 leading-relaxed">
              All prices are in Australian Dollars (AUD) and include GST unless otherwise stated. Prices are subject to change without notice. We reserve the right to limit quantities of products offered and to refuse service to anyone. All product descriptions, images, references, features, content, specifications, products, and prices are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">5. Orders and Payment</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By placing an order, you are making an offer to purchase products subject to these Terms. We reserve the right to refuse or cancel any order for any reason, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Product unavailability</li>
              <li>Errors in pricing or product description</li>
              <li>Suspected fraudulent or unauthorized transactions</li>
              <li>Payment method issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">6. Delivery</h2>
            <p className="text-gray-600 leading-relaxed">
              Delivery times are estimates only and may vary. We are not liable for any delays in delivery. Risk of loss and title for purchased items pass to you upon delivery to the carrier. Free delivery is available for orders over $500 within Australia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">7. Returns and Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              Please refer to our Returns & Refunds Policy for detailed information about returning products and obtaining refunds. Our 120-day return policy applies to most products, subject to terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">8. Warranty</h2>
            <p className="text-gray-600 leading-relaxed">
              All products come with a 10-year structural warranty covering manufacturing defects. Please refer to our Warranty Policy for complete details. This warranty does not affect your statutory rights under Australian Consumer Law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">9. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Vivere In Style or its content suppliers and is protected by Australian and international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the fullest extent permitted by law, Vivere In Style shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our website or products. Our total liability shall not exceed the amount you paid for the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">11. Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">12. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of South Australia, Australia. Any disputes arising from these Terms or your use of our website will be subject to the exclusive jurisdiction of the courts of South Australia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">13. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">14. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-gray-600">
              <p>Vivere In Style</p>
              <p>8/105 O'Sullivan Road, Lonsdale SA 5160, Australia</p>
              <p>Phone: 0424 023 996</p>
              <p>Email: hello@vivereinstyle.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
