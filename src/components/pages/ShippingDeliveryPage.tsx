import { ArrowLeft, Truck, MapPin, Clock, Package } from 'lucide-react';

export function ShippingDeliveryPage() {
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

        <h1 className="text-4xl md:text-5xl mb-6">Shipping & Delivery</h1>
        <p className="text-xl text-gray-600 mb-12">
          Fast, reliable delivery across Australia. Your furniture delivered with care.
        </p>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <Truck className="w-8 h-8 text-gray-900 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Free Delivery</h3>
            <p className="text-gray-600 text-sm">
              On orders over $500
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <Clock className="w-8 h-8 text-gray-900 mx-auto mb-3" />
            <h3 className="text-lg mb-2">5-14 Days</h3>
            <p className="text-gray-600 text-sm">
              Standard delivery time
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <MapPin className="w-8 h-8 text-gray-900 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Australia Wide</h3>
            <p className="text-gray-600 text-sm">
              All states & territories
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl mb-4">Delivery Costs</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer competitive delivery rates across Australia:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>Orders over $500:</strong> Free standard delivery Australia-wide</li>
              <li><strong>Orders under $500:</strong> Flat rate of $99 for standard delivery</li>
              <li><strong>Express delivery:</strong> Available for $199 (3-7 business days)</li>
              <li><strong>White glove service:</strong> $299 (includes unpacking and assembly)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Delivery Timeframes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left">Location</th>
                    <th className="border border-gray-200 px-4 py-3 text-left">Standard</th>
                    <th className="border border-gray-200 px-4 py-3 text-left">Express</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="border border-gray-200 px-4 py-3">Adelaide Metro</td>
                    <td className="border border-gray-200 px-4 py-3">3-5 business days</td>
                    <td className="border border-gray-200 px-4 py-3">1-2 business days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3">Melbourne, Sydney, Brisbane</td>
                    <td className="border border-gray-200 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-200 px-4 py-3">3-4 business days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3">Perth, Canberra, Hobart</td>
                    <td className="border border-gray-200 px-4 py-3">7-10 business days</td>
                    <td className="border border-gray-200 px-4 py-3">5-7 business days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3">Regional Areas</td>
                    <td className="border border-gray-200 px-4 py-3">10-14 business days</td>
                    <td className="border border-gray-200 px-4 py-3">7-10 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Timeframes are estimates and may vary during peak periods or due to unforeseen circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">How Delivery Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-lg mb-2">Order Confirmation</h3>
                  <p className="text-gray-600">
                    You'll receive an email confirmation with your order details and estimated delivery date.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-lg mb-2">Processing</h3>
                  <p className="text-gray-600">
                    Your order is carefully packed and prepared for shipping. This typically takes 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="text-lg mb-2">Dispatch & Tracking</h3>
                  <p className="text-gray-600">
                    Once shipped, you'll receive a tracking number to monitor your delivery in real-time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  4
                </div>
                <div>
                  <h3 className="text-lg mb-2">Delivery Notification</h3>
                  <p className="text-gray-600">
                    Our delivery partner will contact you 24-48 hours before delivery to arrange a convenient time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  5
                </div>
                <div>
                  <h3 className="text-lg mb-2">Delivery</h3>
                  <p className="text-gray-600">
                    Your furniture arrives! Standard delivery includes delivery to your door. White glove service includes room placement and assembly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Delivery Options</h2>
            <div className="space-y-4">
              <div className="p-6 border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl">Standard Delivery</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Free over $500</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Delivery to your door or building entrance. You'll need to move the item to your desired location.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  <li>Delivery to front door or building entrance</li>
                  <li>No assembly included</li>
                  <li>Packaging removal available on request</li>
                </ul>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl">White Glove Service</h3>
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">$299</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Premium service with room placement, assembly, and packaging removal.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  <li>Delivery to room of choice</li>
                  <li>Professional assembly</li>
                  <li>Packaging removal included</li>
                  <li>Furniture placement and positioning</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Inspection on Delivery</h2>
            <p className="text-gray-600 leading-relaxed">
              Please inspect your furniture upon delivery. If you notice any damage or defects, note this on the delivery receipt and contact us immediately. We'll arrange a replacement or repair at no cost to you. Taking photos of any damage will help us resolve issues quickly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Delivery to Apartments & Units</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For deliveries to apartments and units:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Please ensure elevator access is available and can accommodate your furniture</li>
              <li>If no elevator is available, inform us at the time of order</li>
              <li>Stairs delivery may incur additional fees</li>
              <li>Provide access codes or arrange for someone to be present</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Tracking Your Order</h2>
            <p className="text-gray-600 leading-relaxed">
              Once your order ships, you'll receive a tracking number via email. You can track your delivery in real-time through our carrier's website. If you have questions about your delivery, contact our customer service team at 0424 023 996.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Questions about shipping or delivery?
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> delivery@vivereinstyle.com</p>
              <p><strong>Phone:</strong> 0424 023 996</p>
              <p><strong>Hours:</strong> Monday-Friday 9am-6pm ACST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
