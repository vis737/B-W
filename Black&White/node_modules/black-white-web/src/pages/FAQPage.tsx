// apps/web/src/pages/FAQPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Shipping & Delivery',
      q: 'What shipping options are available for domestic and international orders?',
      a: 'We offer complimentary 3-day express shipping via DHL Express on all orders over $150. Diamond and Platinum members receive priority white-glove courier delivery with same-day dispatch.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'How can I track my shipment?',
      a: 'Once your order is packed and dispatched at our Fifth Avenue atelier, a tracking number and live SMS link will be sent to your account. You can also view step-by-step timeline tracking in your Customer Dashboard.'
    },
    {
      category: 'Bank Transfers & Payments',
      q: 'How does Bank Transfer verification work?',
      a: 'When placing an order via Bank Transfer, you will be provided with our JPMorgan Chase account details. After submitting your payment slip image on checkout or in your dashboard, our finance team verifies the transfer within 2 to 4 business hours.'
    },
    {
      category: 'Returns & Exchanges',
      q: 'What is your return policy?',
      a: 'We accept complimentary returns within 30 days of receipt provided items are unworn, unwashed, and in original condition with security tags intact.'
    },
    {
      category: 'Sizing & Tailoring',
      q: 'Do you offer bespoke tailoring services?',
      a: 'Yes. Diamond and Platinum members can schedule complimentary virtual or in-boutique fitting consultations with a B&W master tailor.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em]">Client Assistance</span>
          <h1 className="text-4xl font-serif font-black uppercase tracking-tight mt-1 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-400 text-sm font-light">
            Find answers regarding bespoke sizing, bank transfer approvals, shipping, and membership privileges.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Bank Transfer, Shipping, Returns)..."
              className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs px-4 py-3 rounded-full outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <details key={idx} className="p-6 rounded bg-zinc-950 border border-zinc-800/80 group">
              <summary className="cursor-pointer font-serif font-bold text-base uppercase text-white flex justify-between items-center group-open:text-amber-400 transition-colors">
                <span>{faq.q}</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-xs font-sans text-zinc-400 leading-relaxed font-light">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  Category: {faq.category}
                </span>
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center bg-zinc-950 p-8 rounded border border-zinc-800 space-y-4">
          <h3 className="font-serif font-bold text-xl uppercase text-white">Still Have Questions?</h3>
          <p className="text-zinc-400 text-xs font-light">Our dedicated client concierge is available 24/7 to assist you.</p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-white text-black text-xs uppercase font-bold tracking-widest hover:bg-amber-400 transition-colors"
          >
            Submit Support Ticket &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
