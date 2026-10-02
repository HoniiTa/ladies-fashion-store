import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Styling Concierge Appointment',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: 'Styling Concierge Appointment', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const faqs = [
    {
      q: 'Do you offer international white-glove shipping?',
      a: 'Yes, we provide expedited, insured courier dispatch worldwide. All orders over $150 include complimentary express shipping with full tracking.'
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'We offer a 30-day complimentary return window for unworn items with original security tags and presentation boxes intact.'
    },
    {
      q: 'Can I book a private atelier styling consultation?',
      a: 'Yes, our styling directors in Paris, New York, and Dubai host private salon viewings. You may request an appointment through this concierge portal.'
    },
    {
      q: 'How do I ensure optimal sizing for abayas and gowns?',
      a: 'Our abayas follow traditional length standards (52 to 60 inches from shoulder to hem), while our gowns follow standard international sizing with generous seam allowances for bespoke tailoring.'
    }
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 border border-gold-500/40 bg-white">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-navy-950 font-semibold">
              Client Concierge
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy-950 mb-3">
            Bespoke Customer Service
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-light">
            Our private client advisors are available 7 days a week to assist with styling,
            sizing, order tracking, and bespoke appointments.
          </p>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {/* 2-Column: Form & Flagship info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-8 sm:p-10 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-navy-950 mb-2">
              Send a Concierge Dispatch
            </h2>
            <p className="text-xs text-gray-500 mb-6 font-light">
              We respond to all private patron inquiries within 4 business hours.
            </p>

            {submitted && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-4 border border-emerald-200 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Your dispatch has been received. A senior concierge will be in touch shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Lady Genevieve"
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="genevieve@example.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                >
                  <option value="Styling Concierge Appointment">Private Styling Consultation</option>
                  <option value="Order Status & Delivery">Order Status & Delivery Inquiries</option>
                  <option value="Bespoke Sizing Assistance">Bespoke Sizing Guidance</option>
                  <option value="Press & VIP Partnerships">Press & VIP Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                  Private Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your request or desired garment..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                />
              </div>

              <button
                type="submit"
                className="btn-gold py-3.5 px-8 text-xs font-bold uppercase tracking-wider"
              >
                Dispatch Message
              </button>
            </form>
          </div>

          {/* Flagship Boutiques */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-950 text-white p-8 border border-gold-500/30 shadow-luxury space-y-6">
              <h3 className="font-serif text-xl font-bold text-gold-300 border-b border-gold-500/20 pb-3">
                Flagship Boutiques
              </h3>

              <div className="space-y-4 text-xs font-light">
                <div className="border-b border-navy-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    New York Flagship
                  </h4>
                  <p className="text-gray-300 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                    740 Park Avenue, Upper East Side, New York, NY 10021
                  </p>
                  <p className="text-gray-400 mt-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                    +1 (212) 555-LUXE
                  </p>
                </div>

                <div className="border-b border-navy-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    Paris Atelier
                  </h4>
                  <p className="text-gray-300 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                    14 Rue du Faubourg Saint-Honoré, 75008 Paris, France
                  </p>
                  <p className="text-gray-400 mt-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                    +33 1 42 68 LUXE
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    Dubai Fashion Avenue
                  </h4>
                  <p className="text-gray-300 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                    Fashion Avenue, Level 2, The Dubai Mall, Downtown Dubai
                  </p>
                  <p className="text-gray-400 mt-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                    +971 4 362 LUXE
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gold-500/20 text-xs text-gold-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>Private Consultations by Appointment · 10:00 - 20:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Care FAQ Accordion */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-8 sm:p-10 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-navy-950 text-center mb-8">
            Frequently Inquired Questions
          </h3>

          <div className="divide-y divide-gray-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-serif text-sm font-semibold text-navy-950">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gold-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed font-light">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
