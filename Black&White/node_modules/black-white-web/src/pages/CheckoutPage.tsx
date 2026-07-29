// apps/web/src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { BankTransferWorkflow } from '../components/checkout/BankTransferWorkflow';
import { EmptyState } from '../components/ui/EmptyState';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'cod'>('bank');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [formData, setFormData] = useState({
    fullName: 'Alexander Sterling',
    email: 'alexander.sterling@luxury.com',
    phone: '+1 (555) 234-8890',
    address: '740 Park Avenue, Apt 14B',
    city: 'New York',
    province: 'NY',
    postalCode: '10021',
    country: 'United States',
    giftWrapping: false,
    giftMessage: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'LUXURY15') {
      const discount = cart.subtotal * 0.15;
      setAppliedDiscount(discount);
      showToast('Promotional Code "LUXURY15" applied! (15% OFF)', 'success', 'Coupon Applied');
    } else if (couponCode.toUpperCase() === 'VIPWELCOME') {
      const discount = 50;
      setAppliedDiscount(discount);
      showToast('VIP Voucher applied ($50 OFF)', 'success', 'Coupon Applied');
    } else {
      showToast('Invalid promotional code', 'error');
    }
  };

  const shippingCost = cart.subtotal > 200 ? 0 : 25;
  const total = Math.max(0, cart.subtotal - appliedDiscount + shippingCost);

  const handleSubmitOrder = () => {
    showToast('Your order has been submitted.', 'success', 'Order Confirmed');
    clearCart();
    setStep(3);
  };

  if (cart.items.length === 0 && step !== 3) {
    return (
      <div className="bg-black text-white min-h-screen pt-16 pb-24 container mx-auto px-6">
        <EmptyState
          title="Your Bag is Empty"
          description="You have no items in your haute couture shopping bag."
          actionText="Explore Atelier Catalog"
          onAction={() => window.location.href = '/shop'}
        />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-widest text-center mb-10 border-b border-zinc-800 pb-6">
          Haute Couture Checkout
        </h1>

        {step === 3 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-amber-400/10 border border-amber-400 rounded-full flex items-center justify-center text-amber-400 mx-auto text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-3xl font-serif font-black uppercase text-white">Order Confirmed</h2>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Thank you for shopping with Black & White. Your order reference is{' '}
              <strong className="text-amber-400 font-mono">BW-ORD-2026-991</strong>. Our concierge team is preparing your bespoke packaging.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors shadow"
              >
                Track Order in Dashboard &rarr;
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3 border border-zinc-700 text-white text-xs font-bold uppercase tracking-widest hover:border-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Section */}
            <div className="lg:col-span-7 space-y-8">
              {/* Stepper Header */}
              <div className="flex border-b border-zinc-800 pb-4 text-xs font-mono uppercase tracking-widest">
                <button
                  onClick={() => setStep(1)}
                  className={`flex-1 text-center py-2 ${
                    step === 1 ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-zinc-500'
                  }`}
                >
                  1. Delivery Details
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={`flex-1 text-center py-2 ${
                    step === 2 ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-zinc-500'
                  }`}
                >
                  2. Bank Payment & Proof
                </button>
              </div>

              {step === 1 && (
                <div className="space-y-6 bg-zinc-950/60 p-6 rounded-xl border border-zinc-800">
                  <h3 className="font-serif text-lg font-bold uppercase text-white">Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    variant="primary"
                    size="lg"
                    className="w-full uppercase font-bold text-xs tracking-widest py-4 bg-white text-black hover:bg-amber-400 transition-colors"
                  >
                    Proceed to Direct Wire Payment &rarr;
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Payment Selection Tabs */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 rounded-lg border text-xs font-mono uppercase tracking-wider transition-colors ${
                        paymentMethod === 'bank'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                          : 'border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      🏦 Direct Bank Wire
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-lg border text-xs font-mono uppercase tracking-wider transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                          : 'border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      💳 Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-lg border text-xs font-mono uppercase tracking-wider transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                          : 'border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      🤝 Cash on Delivery
                    </button>
                  </div>

                  {paymentMethod === 'bank' ? (
                    <BankTransferWorkflow
                      orderNumber="BW-ORD-2026-991"
                      totalAmount={total}
                      currency="USD"
                      onReceiptSubmitted={() => {
                        clearCart();
                        setStep(3);
                      }}
                    />
                  ) : (
                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
                      <p className="text-xs text-zinc-300">
                        {paymentMethod === 'card'
                          ? 'Card processing securely routed via international gateway.'
                          : 'Cash on delivery available for selected corporate patrons.'}
                      </p>
                      <button
                        onClick={handleSubmitOrder}
                        className="w-full py-4 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors"
                      >
                        Confirm & Place Order (${total.toLocaleString()})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
                <h3 className="font-serif text-lg font-bold uppercase text-white border-b border-zinc-800 pb-3">
                  Order Summary ({cart.items.length})
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image_url} alt={item.product_name} className="w-10 h-10 object-cover rounded bg-zinc-800" />
                        <div>
                          <div className="font-serif font-bold text-white truncate max-w-[140px]">{item.product_name}</div>
                          <div className="text-[10px] font-mono text-zinc-500">Qty: {item.quantity} • {item.size}</div>
                        </div>
                      </div>
                      <span className="font-mono text-amber-400">${(item.total_price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-zinc-800 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Voucher or Code (LUXURY15)"
                    className="flex-1 bg-black border border-zinc-800 text-xs px-3 py-2 text-white rounded outline-none focus:border-amber-400 uppercase font-mono"
                  />
                  <button type="submit" className="px-4 bg-zinc-800 text-xs font-mono font-bold uppercase hover:bg-zinc-700 text-white rounded">
                    Apply
                  </button>
                </form>

                <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Voucher Discount</span>
                      <span>-${appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Express Courier Shipping</span>
                    <span>{shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total Amount</span>
                    <span className="text-amber-400 font-mono">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;