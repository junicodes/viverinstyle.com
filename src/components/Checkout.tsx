import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Check, Mail, Download, Truck, Star, ShoppingBag, Tag, Plus, Minus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { api } from '../utils/api';
import { Helmet } from 'react-helmet';
import logoImage from 'figma:asset/1bbddcaa197198eb93aced0c28b77cec28693e0a.png';
import { getSupabaseClient } from '../utils/supabase/client';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick?: (product: any) => void;
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

const REVIEWS = [
  { stars: 5, text: 'Fast delivery, beautifully made. Really pulled my living room together.' },
  { stars: 5, text: 'Looks amazing and so happy with the customer service I received. Will definitely be shopping again!' },
  { stars: 5, text: 'The quality is beautiful and the client is very happy. Great customer service too.' },
];

function FloatingInput({ label, value, onChange, type = 'text', required = false, ...props }: any) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
        {...props}
      />
      <label className="absolute left-4 top-2 text-[11px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-gray-500 pointer-events-none">
        {label}
      </label>
    </div>
  );
}

export function Checkout({ isOpen, onClose, onProductClick }: CheckoutProps) {
  const { cart, cartTotal, clearCart, user, accessToken, updateQuantity, removeFromCart } = useStore();
  const [step, setStep] = useState<'details' | 'payment' | 'complete'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingMethodLabel, setShippingMethodLabel] = useState('Australia Post');
  const [shippingEstimateNote, setShippingEstimateNote] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'SA',
    postcode: '',
    saveInfo: false,
    emailOffers: true,
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const subtotal = cartTotal();

  const discountAmount = appliedDiscount
    ? appliedDiscount.type === 'percentage'
      ? (subtotal * appliedDiscount.value) / 100
      : Math.min(appliedDiscount.value, subtotal)
    : 0;
  const total = subtotal - discountAmount + shippingCost;

  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      setShippingCost(0);
      setShippingError(null);
      setShippingMethodLabel('Australia Post');
      setShippingEstimateNote(null);
    }
  }, [isOpen]);

  const loadShippingQuote = async (postcode: string) => {
    if (!/^\d{4}$/.test(postcode)) {
      setShippingCost(0);
      setShippingError(null);
      setShippingMethodLabel('Australia Post');
      setShippingEstimateNote(null);
      return;
    }
    if (cart.length === 0) {
      setShippingCost(0);
      setShippingError(null);
      setShippingMethodLabel('Australia Post');
      setShippingEstimateNote(null);
      return;
    }

    setIsShippingLoading(true);
    try {
      const shipping = await api.getShippingQuote({
        destinationPostcode: postcode,
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      setShippingCost(Number(shipping?.amount || 0));
      setShippingMethodLabel(typeof shipping?.service === 'string' && shipping.service ? shipping.service : 'Australia Post');
      setShippingEstimateNote(
        typeof shipping?.estimateNote === 'string' && shipping.estimateNote ? shipping.estimateNote : null,
      );
      setShippingError(null);
    } catch (err: any) {
      setShippingCost(0);
      setShippingMethodLabel('Australia Post');
      setShippingEstimateNote(null);
      setShippingError(err?.message || 'Unable to calculate shipping');
    } finally {
      setIsShippingLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadShippingQuote(form.postcode);
  }, [isOpen, form.postcode, cart]);

  const u = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const formatCard = (v: string) => v.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').substring(0, 4); return d.length >= 2 ? `${d.substring(0, 2)}/${d.substring(2)}` : d; };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName || !form.lastName || !form.address || !form.city || !form.postcode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Please enter a valid email'); return; }
    if (!/^\d{4}$/.test(form.postcode)) { toast.error('Please enter a valid 4-digit postcode'); return; }
    if (isShippingLoading) { toast.error('Calculating shipping, please wait a moment'); return; }
    if (shippingError) { toast.error('Shipping quote unavailable. Please check postcode and try again.'); return; }
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cardNumber || !form.cardName || !form.cardExpiry || !form.cardCvc) { toast.error('Please fill in all payment details'); return; }
    const clean = form.cardNumber.replace(/\s/g, '');
    if (clean.length < 13) { toast.error('Please enter a valid card number'); return; }
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) { toast.error('Enter expiry as MM/YY'); return; }
    if (!/^\d{3,4}$/.test(form.cardCvc)) { toast.error('Enter a valid CVC'); return; }

    setIsProcessing(true);
    try {
      toast.loading('Processing payment...', { id: 'pay' });
      const pr = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/create-payment-intent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const pd = await pr.json();
      if (!pd.success) throw new Error(pd.error || 'Payment failed');

      const or = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken || publicAnonKey}` },
        body: JSON.stringify({
          customerEmail: form.email, customerName: `${form.firstName} ${form.lastName}`,
          customerPhone: form.phone || null, company: form.company || null,
          shippingAddress: { address: form.address, apartment: form.apartment, city: form.city, state: form.state, postcode: form.postcode },
          items: cart.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image, customization: i.customization })),
          subtotal, discount: discountAmount, discountCode: appliedDiscount?.code || null, shipping: shippingCost, total, userId: user?.id || null,
          paymentIntentId: pd.paymentIntent.id, paymentStatus: 'paid', status: 'processing',
        }),
      });
      const od = await or.json();
      toast.dismiss('pay');
      if (!od.success) throw new Error(od.error || 'Failed to create order');
      setOrderId(od.order.id);
      setStep('complete');
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.dismiss('pay');
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-white">
        <Helmet><title>Order Confirmed - Vivere In Style</title></Helmet>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order</h1>
          <p className="text-gray-500 text-lg mb-8">A confirmation has been sent to <strong className="text-gray-900">{form.email}</strong></p>
          <div className="bg-gray-50 rounded-lg p-5 mb-8 inline-block"><p className="text-xs text-gray-500 mb-1">Order Number</p><p className="text-lg font-mono font-bold text-gray-900">{orderId}</p></div>
          <div className="space-y-2 mb-10 text-gray-500 text-sm">
            <p className="flex items-center justify-center gap-2"><Truck className="w-4 h-4" /> Estimated delivery: 5-10 business days</p>
            <p className="flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Invoice sent to your email</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => window.open(`https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/orders/${orderId}/invoice`, '_blank')}><Download className="w-4 h-4 mr-2" /> Download Invoice</Button>
            <Button onClick={() => { onClose(); setStep('details'); }}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Helmet><title>Checkout - Vivere In Style</title></Helmet>

          {/* LEFT — Form */}
          <div className="flex-1 px-6 sm:px-10 lg:px-16 xl:px-24 py-8 lg:py-12 order-2 lg:order-1">
            {/* Brand */}
            <div className="flex items-center justify-between mb-8">
              <button onClick={onClose} className="flex items-center gap-2">
                <img src={logoImage} alt="Vivere In Style" className="h-10 w-auto" />
                <span className="text-lg font-semibold text-gray-900 hidden sm:inline">Vivere In Style</span>
              </button>
              <button onClick={onClose} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>

            {step === 'details' ? (
              <form onSubmit={handleContinue} className="space-y-7">
                {/* Contact */}
                <section>
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Contact</h2>
                  <FloatingInput label="Email" type="email" value={form.email} onChange={(e: any) => u('email', e.target.value)} required />
                  <label className="flex items-center gap-2 mt-3 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={form.emailOffers} onChange={(e: any) => u('emailOffers', e.target.checked)} className="rounded border-gray-300" />
                    Email me with news and offers
                  </label>
                </section>

                {/* Delivery */}
                <section>
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Delivery</h2>
                  <div className="space-y-3">
                    <div className="px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                      <span className="text-[11px] text-gray-500 block mb-0.5">Country/Region</span>
                      Australia
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingInput label="First name" value={form.firstName} onChange={(e: any) => u('firstName', e.target.value)} required />
                      <FloatingInput label="Last name" value={form.lastName} onChange={(e: any) => u('lastName', e.target.value)} required />
                    </div>
                    <FloatingInput label="Company (optional)" value={form.company} onChange={(e: any) => u('company', e.target.value)} />
                    <FloatingInput label="Address" value={form.address} onChange={(e: any) => u('address', e.target.value)} required />
                    <FloatingInput label="Apartment, suite, etc. (optional)" value={form.apartment} onChange={(e: any) => u('apartment', e.target.value)} />
                    <div className="grid grid-cols-3 gap-3">
                      <FloatingInput label="Suburb" value={form.city} onChange={(e: any) => u('city', e.target.value)} required />
                      <div className="relative">
                        <select value={form.state} onChange={(e) => u('state', e.target.value)} className="w-full px-4 pt-5 pb-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 appearance-none">
                          {AUSTRALIAN_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <label className="absolute left-4 top-2 text-[11px] text-gray-500 pointer-events-none">State/Territory</label>
                      </div>
                      <FloatingInput label="Postcode" value={form.postcode} onChange={(e: any) => u('postcode', e.target.value)} maxLength={4} required />
                    </div>
                    <FloatingInput label="Phone" type="tel" value={form.phone} onChange={(e: any) => u('phone', e.target.value)} />
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.saveInfo} onChange={(e: any) => u('saveInfo', e.target.checked)} className="rounded border-gray-300" />
                      Save this information for next time
                    </label>
                  </div>
                </section>

                {/* Shipping */}
                <section>
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Shipping method</h2>
                  <div className="px-4 py-3 border border-gray-300 rounded-md bg-gray-50 flex justify-between items-start gap-3 text-sm">
                    <div className="text-gray-700 min-w-0">
                      <p className="font-medium text-gray-900">Australia Post</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-3" title={shippingMethodLabel}>{shippingMethodLabel}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Estimated 5–10 business days (varies by service)</p>
                    </div>
                    <span className="font-medium text-gray-900 flex-shrink-0">
                      {isShippingLoading ? 'Calculating...' : shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {shippingError && <p className="text-xs text-red-600 mt-2">{shippingError}</p>}
                  {shippingEstimateNote && !shippingError && (
                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-2">{shippingEstimateNote}</p>
                  )}
                </section>

                <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                  Continue to payment
                </button>
              </form>
            ) : (
              <form onSubmit={handlePay} className="space-y-7">
                {/* Summary bar */}
                <div className="bg-gray-50 rounded-md p-4 text-sm space-y-2 border border-gray-200">
                  <div className="flex justify-between"><span className="text-gray-500">Contact</span><span className="text-gray-900">{form.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Ship to</span><span className="text-gray-900 text-right">{form.address}, {form.city} {form.state} {form.postcode}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-gray-500 flex-shrink-0">Shipping</span><span className="text-gray-900 text-right text-xs sm:text-sm">{isShippingLoading ? 'Calculating...' : shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`} — <span className="line-clamp-2" title={shippingMethodLabel}>{shippingMethodLabel}</span></span></div>
                  <button type="button" onClick={() => { setStep('details'); window.scrollTo(0, 0); }} className="text-blue-600 text-xs hover:underline">Change</button>
                </div>

                {/* Payment */}
                <section>
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Payment</h2>
                  <p className="text-xs text-gray-500 mb-4">All transactions are secure and encrypted.</p>
                  <div className="border border-gray-300 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-900">Credit card</span>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-700 rounded text-white text-[7px] flex items-center justify-center font-bold">VISA</div>
                        <div className="w-8 h-5 bg-red-500 rounded text-white text-[7px] flex items-center justify-center font-bold">MC</div>
                        <div className="w-8 h-5 bg-blue-500 rounded text-white text-[7px] flex items-center justify-center font-bold">AMEX</div>
                      </div>
                    </div>
                    <FloatingInput label="Card number" value={form.cardNumber} onChange={(e: any) => u('cardNumber', formatCard(e.target.value))} maxLength={19} required />
                    <FloatingInput label="Name on card" value={form.cardName} onChange={(e: any) => u('cardName', e.target.value)} required />
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingInput label="Expiration date (MM/YY)" value={form.cardExpiry} onChange={(e: any) => u('cardExpiry', formatExpiry(e.target.value))} maxLength={5} required />
                      <FloatingInput label="Security code" value={form.cardCvc} onChange={(e: any) => u('cardCvc', e.target.value.replace(/\D/g, ''))} maxLength={4} required />
                    </div>
                  </div>
                </section>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep('details'); window.scrollTo(0, 0); }} className="flex-1 py-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Return to shipping
                  </button>
                  <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {isProcessing ? 'Processing...' : `Pay AUD $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 text-xs text-blue-600">
              <button onClick={onClose} className="hover:underline">Return to cart</button>
              <span className="text-gray-300">|</span>
              <span className="text-gray-400">Shipping policy</span>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="w-full lg:w-[420px] xl:w-1/2 flex-shrink-0 bg-[#fafafa] lg:border-l border-t lg:border-t-0 border-gray-200 px-6 sm:px-10 py-8 lg:py-12 order-1 lg:order-2">
            {/* Cart items */}
            <div className="space-y-4 pb-6">
              {cart.map(item => (
                <div key={`${item.productId}-${JSON.stringify(item.customization)}`} className="flex gap-3 items-start">
                  <button
                    type="button"
                    onClick={() => onProductClick?.({ id: item.productId })}
                    className="relative flex-shrink-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                    {item.customization?.material && <p className="text-xs text-gray-500">{item.customization.material}</p>}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.customization)}
                        className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-medium w-7 text-center tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.customization)}
                        className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove from cart"
                        onClick={() => removeFromCart(item.productId, item.customization)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 flex-shrink-0 pt-0.5">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <div className="flex gap-2 pb-6 border-b border-gray-200">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Discount code or gift card"
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <button type="button" disabled={applyingDiscount} onClick={async () => {
                if (!discountCode.trim()) return;
                setApplyingDiscount(true);
                try {
                  const supabase = getSupabaseClient();
                  const { data } = await supabase.from('kv_store_e9dccf07').select('value').eq('key', `discount:${discountCode.toUpperCase().trim()}`).maybeSingle() as { data: any };
                  if (!data?.value) { toast.error('Invalid discount code'); setApplyingDiscount(false); return; }
                  const d = data.value;
                  if (!d.active) { toast.error('This code is no longer active'); setApplyingDiscount(false); return; }
                  if (d.expiresAt && new Date(d.expiresAt) < new Date()) { toast.error('This code has expired'); setApplyingDiscount(false); return; }
                  if (d.maxUses && d.usedCount >= d.maxUses) { toast.error('This code has reached its usage limit'); setApplyingDiscount(false); return; }
                  if (d.minOrder > 0 && subtotal < d.minOrder) { toast.error(`Minimum order of $${d.minOrder} required`); setApplyingDiscount(false); return; }
                  if (d.productIds?.length > 0) {
                    const cartProductIds = cart.map(i => i.productId);
                    const hasMatch = d.productIds.some((pid: string) => cartProductIds.includes(pid));
                    if (!hasMatch) { toast.error('This code does not apply to items in your cart'); setApplyingDiscount(false); return; }
                  }
                  setAppliedDiscount(d);
                  const saving = d.type === 'percentage' ? `${d.value}%` : `$${d.value}`;
                  toast.success(`Discount applied! ${saving} off`);
                } catch { toast.error('Failed to validate code'); }
                setApplyingDiscount(false);
              }} className="px-5 py-2.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50">
                {applyingDiscount ? '...' : 'Apply'}
              </button>
            </div>

            {/* Totals */}
            <div className="py-4 space-y-2 text-sm border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {appliedDiscount.code} ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `$${appliedDiscount.value}`})
                  </span>
                  <span className="text-green-600 font-medium">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900 font-medium">{isShippingLoading ? 'Calculating...' : shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="py-4 border-b border-gray-200">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-gray-600">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-400 mr-2">AUD</span>
                  <span className="text-xl font-semibold text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including ${(total * 0.1).toFixed(2)} in taxes</p>
              {discountAmount > 0 && (
                <p className="text-xs text-green-600 mt-1 font-medium">TOTAL SAVINGS ${discountAmount.toFixed(2)}</p>
              )}
            </div>

            {/* Reviews */}
            <div className="pt-6 space-y-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-3 h-3 fill-gray-900 text-gray-900" />)}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center pt-2">Support: 0424 023 996</p>
            </div>
          </div>
    </div>
  );
}
