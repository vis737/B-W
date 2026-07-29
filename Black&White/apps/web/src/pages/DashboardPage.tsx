import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CUSTOMER, MOCK_ORDERS, MOCK_ADDRESSES, MOCK_COUPONS, MOCK_PRODUCTS } from '../data/mockData';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

type DashboardTab =
  | 'overview'
  | 'profile'
  | 'addresses'
  | 'orders'
  | 'wishlist'
  | 'loyalty'
  | 'membership'
  | 'coupons'
  | 'referrals'
  | 'notifications'
  | 'tickets'
  | 'returns'
  | 'privacy';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { customer, logoutCustomer } = useAuth();
  const navigate = useNavigate();

  // Address form
  const [newAddress, setNewAddress] = useState({
    title: 'Home Residence',
    recipient_name: customer?.name || MOCK_CUSTOMER.full_name,
    street_address: '',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    country: 'United States',
    phone: MOCK_CUSTOMER.mobile_number,
    type: 'home' as 'home' | 'office' | 'other',
    is_default: true,
  });

  // Profile Form state
  const [profileData, setProfileData] = useState({
    fullName: customer?.name || MOCK_CUSTOMER.full_name,
    email: customer?.email || MOCK_CUSTOMER.email,
    mobile: MOCK_CUSTOMER.mobile_number,
    dob: '1990-05-14',
    gender: 'male',
  });

  // Ticket Form state
  const [ticketData, setTicketData] = useState({ subject: '', category: 'order', priority: 'medium', message: '' });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account profile details updated successfully.', 'success', 'Profile Saved');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`New address (${newAddress.type.toUpperCase()}) added to address book.`, 'success', 'Address Saved');
    setShowAddressModal(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Support ticket logged. An agent will respond shortly.', 'success', 'Ticket Logged');
    setShowTicketModal(false);
    setTicketData({ subject: '', category: 'order', priority: 'medium', message: '' });
  };

  const handleReorder = (order: typeof MOCK_ORDERS[0]) => {
    const prod = MOCK_PRODUCTS[0];
    addItem({
      id: `cart-${Date.now()}`,
      product_id: prod.id,
      variant_id: prod.variants[0].id,
      product_name: prod.name,
      product_slug: prod.slug,
      image_url: prod.images[0].url,
      quantity: 1,
      unit_price: order.subtotal,
      total_price: order.subtotal,
      color: prod.variants[0].color,
      size: prod.variants[0].size,
    });
    showToast('Items reordered and added to your shopping bag.', 'success', 'Reordered');
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    showToast(`Generating official PDF invoice for ${orderNumber}...`, 'info', 'Invoice Download');
    setTimeout(() => {
      showToast(`PDF Invoice for ${orderNumber} downloaded.`, 'success', 'Downloaded');
    }, 800);
  };

  const handleLogout = () => {
    logoutCustomer();
    showToast('You have logged out of your account.', 'info', 'Signed Out');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    logoutCustomer();
    showToast('Account deletion request queued. Your personal data has been erased.', 'info', 'Account Closed');
    navigate('/');
  };

  const tabs: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '❖' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'addresses', label: 'Saved Addresses', icon: '📍' },
    { id: 'orders', label: 'Orders & Invoices', icon: '📦' },
    { id: 'wishlist', label: 'My Wishlist', icon: '❤️' },
    { id: 'loyalty', label: 'Loyalty & Rewards', icon: '⭐' },
    { id: 'membership', label: 'Membership Status', icon: '👑' },
    { id: 'coupons', label: 'Coupons & Vouchers', icon: '🏷️' },
    { id: 'referrals', label: 'Referrals & VIP', icon: '🎁' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'tickets', label: 'Support Center', icon: '💬' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-10 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Top Header Card */}
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-black font-serif font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-400/20">
              {(customer?.name || MOCK_CUSTOMER.full_name).charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white uppercase">{customer?.name || MOCK_CUSTOMER.full_name}</h1>
                <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-400 border border-amber-400/40 text-[10px] uppercase font-bold tracking-widest rounded-full">
                  {customer?.membership_tier || 'Platinum VIP'}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Client ID: <span className="text-zinc-200">{customer?.customer_id || 'BW-CUST-8812'}</span> | Member Since Nov 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Privilege Points</span>
              <span className="text-2xl font-mono font-bold text-amber-400">1,420 PTS</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 font-mono text-xs uppercase rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Sub-View Content */}
          <div className="lg:col-span-9">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome & Profile Completion */}
                <div className="bg-gradient-to-r from-zinc-950 via-black to-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-amber-400 font-mono text-xs uppercase">Welcome Back</span>
                      <h2 className="text-xl font-serif font-bold text-white uppercase">Profile Completion: 85%</h2>
                    </div>
                    <span className="px-3 py-1 bg-amber-400/20 text-amber-400 font-mono text-xs rounded font-bold">1 Action Remaining</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[85%]" />
                  </div>
                  <p className="text-xs text-zinc-400 font-light">Add your mobile number for instant WhatsApp concierge delivery updates to unlock 100 bonus privilege points.</p>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-xs font-mono text-zinc-500 uppercase">Total Orders</span>
                    <h3 className="text-3xl font-mono font-bold text-white">{MOCK_ORDERS.length}</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">2 Shipped • 1 Processing</span>
                  </div>

                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-xs font-mono text-zinc-500 uppercase">Lifetime Spend</span>
                    <h3 className="text-3xl font-mono font-bold text-amber-400">$4,290.00</h3>
                    <span className="text-[10px] text-zinc-400 font-mono">Platinum Tier Active</span>
                  </div>

                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-xs font-mono text-zinc-500 uppercase">Saved Wishlist</span>
                    <h3 className="text-3xl font-mono font-bold text-white">{wishlist.length} Items</h3>
                    <button onClick={() => setActiveTab('wishlist')} className="text-[10px] text-amber-400 font-mono hover:underline">View Saved Items &rarr;</button>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif font-bold text-lg uppercase text-white">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-mono text-amber-400 hover:underline">View All Orders &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ORDERS.slice(0, 2).map((ord) => (
                      <div key={ord.id} className="p-4 bg-black border border-zinc-800 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono text-white font-bold block">{ord.order_number}</span>
                          <span className="text-zinc-500">{ord.created_at.split('T')[0]} • ${ord.total.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="px-2.5 py-1 bg-amber-400/20 text-amber-400 font-mono font-bold text-[10px] uppercase rounded">
                            {ord.status}
                          </span>
                          <button onClick={() => setSelectedOrder(ord)} className="px-3 py-1 bg-zinc-800 text-white rounded text-[11px] hover:bg-amber-400 hover:text-black font-bold uppercase">
                            Track
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl space-y-6">
                <h2 className="font-serif font-bold text-xl uppercase text-white border-b border-zinc-800 pb-4">Edit Personal Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={profileData.dob}
                        onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                        className="w-full bg-black border border-zinc-800 p-3 rounded text-zinc-300 outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white transition-colors">
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif font-bold text-xl uppercase text-white">Saved Addresses</h2>
                  <button onClick={() => setShowAddressModal(true)} className="px-4 py-2 bg-amber-400 text-black font-bold text-xs uppercase rounded">
                    + Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_ADDRESSES.map((addr: any) => (
                    <div key={addr.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-400 font-mono text-[10px] uppercase font-bold rounded">
                          {addr.label || addr.title || 'Address'}
                        </span>
                        {addr.is_default && <span className="text-[10px] font-mono text-emerald-400">Default Address</span>}
                      </div>
                      <h4 className="font-bold text-white text-sm">{addr.full_name || addr.recipient_name || 'Alexander Sterling'}</h4>
                      <p className="text-xs text-zinc-400 font-light">
                        {addr.address_line_1 || addr.street_address}, {addr.city}, {addr.province || addr.state} {addr.postal_code}, {addr.country}
                      </p>
                      <p className="text-xs font-mono text-zinc-500">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-xl uppercase text-white">Order History & Timeline Tracking</h2>
                <div className="space-y-4">
                  {MOCK_ORDERS.map((ord) => (
                    <div key={ord.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                        <div>
                          <span className="font-mono text-amber-400 font-bold block text-sm">{ord.order_number}</span>
                          <span className="text-xs text-zinc-500">Placed on {ord.created_at.split('T')[0]}</span>
                        </div>
                        <span className="px-3 py-1 bg-amber-400/20 text-amber-400 font-mono text-xs uppercase font-bold rounded">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-zinc-300 font-mono">
                        <span>Total: <strong className="text-white">${ord.total.toFixed(2)}</strong></span>
                        <div className="flex gap-2">
                          <button onClick={() => handleDownloadInvoice(ord.order_number)} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-bold uppercase hover:bg-zinc-800">
                            📄 Download Invoice PDF
                          </button>
                          <button onClick={() => handleReorder(ord)} className="px-3 py-1.5 bg-amber-400 text-black font-bold uppercase rounded hover:bg-white">
                            🔄 Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-xl uppercase text-white">Saved Wishlist ({wishlist.length})</h2>
                {wishlist.length === 0 ? (
                  <p className="text-xs font-mono text-zinc-500">Your wishlist is currently empty.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex gap-4 items-center">
                        <img src={item.images[0]?.url} alt={item.name} className="w-16 h-20 object-cover rounded bg-zinc-900" />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-white text-xs">{item.name}</h4>
                          <span className="text-amber-400 font-mono font-bold text-xs">${item.base_price}</span>
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => {
                                addItem({
                                  id: `c-${Date.now()}`,
                                  product_id: item.id,
                                  variant_id: item.variants[0]?.id || 'v-default',
                                  product_name: item.name,
                                  product_slug: item.slug,
                                  image_url: item.images[0]?.url || '',
                                  quantity: 1,
                                  unit_price: item.base_price,
                                  discount_price: item.discount_price,
                                  total_price: item.discount_price || item.base_price,
                                  color: item.variants[0]?.color || 'Black',
                                  size: item.variants[0]?.size || 'M',
                                });
                                showToast('Item moved to cart.', 'success', 'Cart Updated');
                              }}
                              className="px-3 py-1 bg-amber-400 text-black font-bold text-[10px] uppercase rounded"
                            >
                              Move to Bag
                            </button>
                            <button onClick={() => removeFromWishlist(item.id)} className="px-3 py-1 bg-zinc-800 text-zinc-400 font-bold text-[10px] uppercase rounded">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: LOYALTY & MEMBERSHIP */}
            {(activeTab === 'loyalty' || activeTab === 'membership') && (
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-amber-400 font-mono text-xs uppercase">B&W Society Privilege</span>
                    <h2 className="text-2xl font-serif font-bold text-white uppercase">Platinum VIP Status</h2>
                  </div>
                  <span className="text-3xl font-mono font-bold text-amber-400">1,420 PTS</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Progress to Diamond Tier ($5,000 Spend Required)</span>
                    <span className="text-amber-400 font-bold">85% Complete</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                    <div className="bg-amber-400 h-full w-[85%]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-1 text-xs">
                    <span className="text-amber-400 font-mono font-bold">Perk 1</span>
                    <h4 className="text-white font-bold uppercase">15% Off All Orders</h4>
                    <p className="text-zinc-500">Applied automatically at checkout.</p>
                  </div>
                  <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-1 text-xs">
                    <span className="text-amber-400 font-mono font-bold">Perk 2</span>
                    <h4 className="text-white font-bold uppercase">Private Concierge</h4>
                    <p className="text-zinc-500">24/7 dedicated personal stylist.</p>
                  </div>
                  <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-1 text-xs">
                    <span className="text-amber-400 font-mono font-bold">Perk 3</span>
                    <h4 className="text-white font-bold uppercase">Free Express Shipping</h4>
                    <p className="text-zinc-500">Complimentary white-glove delivery.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-xl uppercase text-white">Active Vouchers ({MOCK_COUPONS.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_COUPONS.map((c) => (
                    <div key={c.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 relative">
                      <span className="text-xs font-mono text-amber-400 font-bold tracking-widest">{c.code}</span>
                      <h3 className="text-2xl font-serif font-bold text-white">{c.value}% OFF</h3>
                      <p className="text-xs text-zinc-400">Min spend: ${c.min_order_amount}. Valid until {c.expires_at}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: PRIVACY & SECURITY */}
            {activeTab === 'privacy' && (
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl space-y-6">
                <h2 className="font-serif font-bold text-xl uppercase text-white border-b border-zinc-800 pb-4">Privacy Settings & Account Controls</h2>
                <div className="space-y-4 text-xs font-sans">
                  <div className="p-4 bg-black border border-zinc-800 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-bold uppercase">Two-Factor Authentication (2FA)</h4>
                      <p className="text-zinc-500">Secure account with SMS/Authenticator OTP.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px] rounded uppercase">Enabled</span>
                  </div>

                  <div className="p-4 bg-black border border-red-900/40 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-red-400 font-bold uppercase">Delete Account & Data</h4>
                      <p className="text-zinc-500">Permanently erase your patron history and personal records.</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-950 border border-red-800 text-red-400 font-bold text-xs uppercase rounded hover:bg-red-900"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback for other tabs */}
            {!['overview', 'profile', 'addresses', 'orders', 'wishlist', 'loyalty', 'membership', 'coupons', 'privacy'].includes(activeTab) && (
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl text-center space-y-3">
                <h3 className="font-serif font-bold text-xl uppercase text-white">{activeTab.toUpperCase()}</h3>
                <p className="text-xs text-zinc-400">All data synchronized with B&W Private Reserve.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-md w-full space-y-4">
            <h3 className="font-serif font-bold text-lg uppercase text-red-400">Confirm Account Deletion</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete your B&W VIP account? This action is permanent and will erase all accumulated privilege points and reward benefits.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 bg-zinc-900 text-white font-bold text-xs uppercase rounded">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className="flex-1 py-2.5 bg-red-950 border border-red-800 text-red-400 font-bold text-xs uppercase rounded hover:bg-red-900">
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-base uppercase text-white">Add Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs font-sans">
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Address Label Tag</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as any })}
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                >
                  <option value="home">Home Residence</option>
                  <option value="office">Executive Office</option>
                  <option value="other">Other Villa / Residence</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddress.street_address}
                  onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                  placeholder="e.g. 740 Park Avenue, Apt 14B"
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Order Dispatch Status</span>
                <h3 className="font-serif font-bold text-lg uppercase text-white">{selectedOrder.order_number}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span>Total Amount:</span>
                <span className="text-amber-400 font-bold">${selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Current Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedOrder.status}</span>
              </div>
              <div className="p-4 bg-zinc-900 rounded border border-zinc-800 space-y-2">
                <div className="text-[10px] text-zinc-500 uppercase">Live Courier Tracking Code</div>
                <div className="text-sm font-bold text-white tracking-widest">BW-DHL-EXPRESS-9842019</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-base uppercase text-white">Log Concierge Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  placeholder="e.g. Sizing query for bespoke suit"
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Details</label>
                <textarea
                  rows={3}
                  required
                  value={ticketData.message}
                  onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                  placeholder="Explain how our concierge can assist..."
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded">
                Log Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
