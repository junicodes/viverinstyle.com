import { ArrowLeft, Package, Clock, CreditCard, CheckCircle } from 'lucide-react';

export function ReturnsRefundsPage() {
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

        <h1 className="text-4xl md:text-5xl mb-6">Returns & Refunds</h1>
        <p className="text-xl text-gray-600 mb-12">
          We want you to love your furniture. If you're not completely satisfied, we're here to help.
        </p>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-gray-50 rounded-xl">
            <Clock className="w-8 h-8 text-gray-900 mb-3" />
            <h3 className="text-xl mb-2">120-Day Returns</h3>
            <p className="text-gray-600">
              You have 120 days from delivery to return your furniture for any reason.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <CreditCard className="w-8 h-8 text-gray-900 mb-3" />
            <h3 className="text-xl mb-2">Full Refunds</h3>
            <p className="text-gray-600">
              Receive a complete refund of your purchase price, no questions asked.
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl mb-4">Our 120-Day Return Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              At Vivere In Style, we believe you should have ample time to decide if your new furniture is the perfect fit for your home. That's why we offer an industry-leading 120-day return period on all our products. If you're not completely satisfied, simply return the item within 120 days of delivery for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Return Conditions</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To qualify for a return, items must meet the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Item must be in original, unused condition</li>
              <li>All original packaging, tags, and labels must be intact</li>
              <li>No signs of assembly, wear, or damage</li>
              <li>All accessories and components must be included</li>
              <li>Return must be initiated within 120 days of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">How to Return an Item</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-lg mb-2">Contact Us</h3>
                  <p className="text-gray-600">
                    Email us at returns@vivereinstyle.com or call 0424 023 996. Provide your order number and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-lg mb-2">Get Authorization</h3>
                  <p className="text-gray-600">
                    We'll provide you with a Return Merchandise Authorization (RMA) number and return instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="text-lg mb-2">Pack Securely</h3>
                  <p className="text-gray-600">
                    Repack the item in its original packaging. Include all accessories, manuals, and components.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  4
                </div>
                <div>
                  <h3 className="text-lg mb-2">Ship It Back</h3>
                  <p className="text-gray-600">
                    We'll arrange pickup or provide you with a prepaid shipping label. For defective items, return shipping is free.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Refund Process</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Once we receive your returned item:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>We'll inspect the item within 2-3 business days</li>
              <li>If approved, your refund will be processed to your original payment method</li>
              <li>Refunds typically appear in 5-10 business days depending on your bank</li>
              <li>You'll receive email confirmation once the refund is processed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Return Shipping Costs</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>Free Returns:</strong> If the item is defective, damaged, or we sent the wrong item, we'll cover all return shipping costs.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Standard Returns:</strong> If you're returning for other reasons (change of mind, doesn't fit your space, etc.), return shipping fees may apply. We'll provide the most cost-effective shipping option.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Exchanges</h2>
            <p className="text-gray-600 leading-relaxed">
              We don't offer direct exchanges. If you'd like a different product, simply return the original item for a refund and place a new order for your preferred item. This ensures you get the fastest service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If your item arrives damaged or defective:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Contact us immediately with photos of the damage</li>
              <li>We'll arrange a free return pickup</li>
              <li>Choose between a replacement or full refund</li>
              <li>Priority processing for damaged/defective items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Custom Orders</h2>
            <p className="text-gray-600 leading-relaxed">
              Custom-made or personalized items may have different return policies. Please contact us before ordering if you have questions about returning customized furniture.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Sale Items</h2>
            <p className="text-gray-600 leading-relaxed">
              Sale and clearance items are eligible for return under the same 120-day policy, unless specifically marked as "final sale" at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Have questions about returns or refunds? We're here to help:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> returns@vivereinstyle.com</p>
              <p><strong>Phone:</strong> 0424 023 996</p>
              <p><strong>Hours:</strong> Monday-Friday 9am-6pm ACST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
