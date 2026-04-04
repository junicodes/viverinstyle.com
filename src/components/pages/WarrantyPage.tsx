import { Header } from '../Header';
import { Footer } from '../Footer';
import { Cart } from '../Cart';
import { ArrowLeft, Shield, Award, Clock } from 'lucide-react';

export function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Cart />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>

        <h1 className="text-4xl md:text-5xl mb-6">Warranty Information</h1>
        <p className="text-xl text-gray-600 mb-12">
          Quality furniture backed by our comprehensive 10-year warranty
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <Shield className="w-8 h-8 text-gray-900 mx-auto mb-3" />
            <h3 className="text-lg mb-2">10-Year Warranty</h3>
            <p className="text-gray-600 text-sm">Structural coverage</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <Award className="w-8 h-8 text-gray-900 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Quality Assured</h3>
            <p className="text-gray-600 text-sm">Premium materials</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <Clock className="w-8 h-8 text-gray-900 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Fast Service</h3>
            <p className="text-gray-600 text-sm">Quick claim processing</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl mb-4">Our 10-Year Warranty</h2>
            <p className="text-gray-600 leading-relaxed">
              Vivere In Style stands behind the quality of our furniture. All our products come with a comprehensive 10-year structural warranty covering manufacturing defects and structural failures. This warranty is our commitment to you that your furniture is built to last.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">What's Covered</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Structural defects in frames and joints</li>
              <li>Manufacturing defects in materials</li>
              <li>Faulty mechanisms (recliners, adjustable features)</li>
              <li>Defective hardware and fittings</li>
              <li>Finish deterioration under normal use</li>
              <li>Spring and cushion support systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">What's Not Covered</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Normal wear and tear</li>
              <li>Damage from misuse or improper care</li>
              <li>Fabric fading or pilling from regular use</li>
              <li>Damage from pets, children, or accidents</li>
              <li>Damage during customer transportation</li>
              <li>Modifications made without authorization</li>
              <li>Commercial or non-residential use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Making a Warranty Claim</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-lg mb-2">Contact Us</h3>
                  <p className="text-gray-600">
                    Email warranty@vivereinstyle.com with your order number, photos of the issue, and description of the problem.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-lg mb-2">Assessment</h3>
                  <p className="text-gray-600">
                    Our team will review your claim within 2 business days and may request additional information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="text-lg mb-2">Resolution</h3>
                  <p className="text-gray-600">
                    If approved, we'll repair, replace, or refund the item at our discretion. We cover all shipping costs for warranty claims.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Extended Warranty Options</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Want even more protection? We offer extended warranty plans:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>5-Year Fabric Protection:</strong> Covers stains, tears, and accidental damage to upholstery</li>
              <li><strong>Lifetime Frame Warranty:</strong> Extended structural coverage for the lifetime of the product</li>
              <li><strong>All-Risk Protection:</strong> Comprehensive coverage including accidental damage and normal wear</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Australian Consumer Law</h2>
            <p className="text-gray-600 leading-relaxed">
              This warranty is in addition to your statutory rights under the Australian Consumer Law. Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Care & Maintenance</h2>
            <p className="text-gray-600 leading-relaxed">
              To keep your furniture looking great and maintain warranty coverage:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
              <li>Follow all care instructions provided with your furniture</li>
              <li>Clean spills immediately</li>
              <li>Avoid direct sunlight and heat sources</li>
              <li>Use appropriate cleaning products for your furniture's material</li>
              <li>Rotate cushions regularly for even wear</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4">Contact Warranty Department</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> warranty@vivereinstyle.com</p>
              <p><strong>Phone:</strong> 1300 123 456</p>
              <p><strong>Hours:</strong> Monday-Friday 9am-6pm ACST</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
