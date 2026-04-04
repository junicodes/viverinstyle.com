import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Lock, Check, ShoppingBag, MapPin, Mail, Phone, User, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { cart, cartTotal, clearCart, user, accessToken } = useStore();
  const [step, setStep] = useState<'details' | 'payment' | 'complete'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [customerDetails, setCustomerDetails] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: 'VIC',
    postcode: '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleCustomerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName || 
        !customerDetails.address || !customerDetails.city || !customerDetails.postcode) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate postcode (Australian postcodes are 4 digits)
    if (!/^\d{4}$/.test(customerDetails.postcode)) {
      toast.error('Please enter a valid Australian postcode (4 digits)');
      return;
    }

    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment details
    if (!paymentDetails.cardNumber || !paymentDetails.cardName || 
        !paymentDetails.cardExpiry || !paymentDetails.cardCvc) {
      toast.error('Please fill in all payment details');
      return;
    }

    // Validate card number (remove spaces and check if 16 digits)
    const cleanCardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }

    // Validate expiry (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry)) {
      toast.error('Please enter expiry in MM/YY format');
      return;
    }

    // Validate CVC (3 or 4 digits)
    if (!/^\d{3,4}$/.test(paymentDetails.cardCvc)) {
      toast.error('Please enter a valid CVC (3-4 digits)');
      return;
    }

    // Validate cart total against Stripe's maximum
    const total = cartTotal();
    if (total > 999999.99) {
      toast.error('Cart total exceeds maximum allowed amount of $999,999.99');
      return;
    }

    if (total <= 0) {
      toast.error('Cart total must be greater than $0');
      return;
    }

    setIsProcessing(true);
    
    try {
      toast.loading('Processing payment...', { id: 'payment' });

      // Step 1: Create Stripe Payment Intent
      const paymentResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            amount: Math.round(cartTotal() * 100), // Convert to cents
          }),
        }
      );

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        throw new Error(paymentData.error || 'Payment failed');
      }

      // Step 2: Create the order
      const orderResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || publicAnonKey}`,
          },
          body: JSON.stringify({
            customerEmail: customerDetails.email,
            customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
            customerPhone: customerDetails.phone || null,
            shippingAddress: {
              address: customerDetails.address,
              city: customerDetails.city,
              state: customerDetails.state,
              postcode: customerDetails.postcode,
            },
            items: cart.map(item => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              customization: item.customization,
            })),
            total: cartTotal(),
            userId: user?.id || null,
            paymentIntentId: paymentData.paymentIntent.id,
            paymentStatus: 'paid',
            status: 'processing',
          }),
        }
      );

      const orderData = await orderResponse.json();

      toast.dismiss('payment');

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Success!
      setOrderId(orderData.order.id);
      setStep('complete');
      clearCart();
      toast.success('Order placed successfully! 🎉');

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.dismiss('payment');
      toast.error(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== 'complete' ? onClose : undefined}
          className="absolute inset-0"
        />

        {/* Checkout Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white dark:bg-black rounded-3xl shadow-2xl max-w-4xl w-full my-8"
        >
          {step === 'complete' ? (
            // Order Complete Screen
            <div className="p-8 text-center">
              <button
                onClick={() => {
                  onClose();
                  setStep('details');
                  setCustomerDetails({ email: user?.email || '', firstName: '', lastName: '', phone: '', address: '', city: '', state: 'VIC', postcode: '' });
                  setPaymentDetails({ cardNumber: '', cardName: '', cardExpiry: '', cardCvc: '' });
                }}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
              </motion.div>

              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Order Confirmed!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Thank you for your order. We've sent a confirmation email to <strong>{customerDetails.email}</strong>
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Order Number</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{orderId}</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>Invoice sent to your email</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Estimated delivery: 5-7 business days</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    window.open(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/orders/${orderId}/invoice`, '_blank');
                    toast.success('Invoice downloaded!');
                  }}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    onClose();
                    setStep('details');
                    setCustomerDetails({ email: user?.email || '', firstName: '', lastName: '', phone: '', address: '', city: '', state: 'VIC', postcode: '' });
                    setPaymentDetails({ cardNumber: '', cardName: '', cardExpiry: '', cardCvc: '' });
                  }}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-gray-800 bg-white dark:bg-black">
                <div className="flex-1 pr-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {step === 'details' ? 'Delivery Details' : 'Payment'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {step === 'details' ? 'Where should we deliver your order?' : 'Secure payment powered by Stripe'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b dark:border-gray-800 bg-white dark:bg-black">
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                      step === 'details' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-green-500 text-white'
                    }`}>
                      {step === 'payment' || step === 'complete' ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '1'}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Details</span>
                  </div>
                  <div className="w-8 sm:w-12 h-0.5 bg-gray-300 dark:bg-gray-700" />
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                      step === 'payment' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      2
                    </div>
                    <span className={`text-sm sm:text-base font-medium ${step === 'payment' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      Payment
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Main Form */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-white dark:bg-black">
                  {step === 'details' ? (
                    <form onSubmit={handleCustomerDetailsSubmit} className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                          <Mail className="w-5 h-5" />
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={customerDetails.email}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number (optional)</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={customerDetails.phone}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                              placeholder="04XX XXX XXX"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Customer Name */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                          <User className="w-5 h-5" />
                          Full Name
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={customerDetails.firstName}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, firstName: e.target.value })}
                              placeholder="John"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={customerDetails.lastName}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, lastName: e.target.value })}
                              placeholder="Smith"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                          <MapPin className="w-5 h-5" />
                          Delivery Address
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                              id="address"
                              value={customerDetails.address}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                              placeholder="123 Main Street"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={customerDetails.city}
                                onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })}
                                placeholder="Melbourne"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State *</Label>
                              <select
                                id="state"
                                value={customerDetails.state}
                                onChange={(e) => setCustomerDetails({ ...customerDetails, state: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                required
                              >
                                {AUSTRALIAN_STATES.map(state => (
                                  <option key={state.value} value={state.value}>{state.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="postcode">Postcode *</Label>
                            <Input
                              id="postcode"
                              value={customerDetails.postcode}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, postcode: e.target.value })}
                              placeholder="3000"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Continue to Payment
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div className="bg-blue-50 dark:bg-black border border-blue-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Test Mode</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Use card number: <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded font-mono">4242 4242 4242 4242</code>
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Any future expiry date and any 3-digit CVC
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                          <CreditCard className="w-5 h-5" />
                          Payment Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardName">Cardholder Name *</Label>
                            <Input
                              id="cardName"
                              value={paymentDetails.cardName}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                              placeholder="John Smith"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              value={paymentDetails.cardNumber}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: formatCardNumber(e.target.value) })}
                              placeholder="4242 4242 4242 4242"
                              maxLength={19}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cardExpiry">Expiry Date *</Label>
                              <Input
                                id="cardExpiry"
                                value={paymentDetails.cardExpiry}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: formatExpiry(e.target.value) })}
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardCvc">CVC *</Label>
                              <Input
                                id="cardCvc"
                                value={paymentDetails.cardCvc}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvc: e.target.value.replace(/\D/g, '') })}
                                placeholder="123"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={() => setStep('details')}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>Pay ${cartTotal().toLocaleString()} AUD</>
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        Secure payment powered by Stripe
                      </p>
                    </form>
                  )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:w-96 bg-gray-50 dark:bg-black p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={`${item.productId}-${JSON.stringify(item.customization)}`} className="flex gap-3">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">${item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 py-4 border-t dark:border-gray-700">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>${cartTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Delivery</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t dark:border-gray-700 text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${cartTotal().toLocaleString()} AUD</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Express delivery Australia-wide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>10-year warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>120-day returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}