import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Fire celebratory gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#DFBA73', '#0A1128', '#F3E5AB'],
      });
    } catch (e) {
      console.log('Confetti notice:', e);
    }
  }, []);

  return (
    <div className="bg-[#FDFBF7] min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white border border-gold-500/40 p-8 sm:p-12 shadow-luxury text-center relative overflow-hidden">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#DFBA73] via-[#D4AF37] to-[#C5A059]" />

        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-gold-500" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-2">
          Order Confirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mb-3">
          Thank You For Your Patronage
        </h1>

        <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
          Your haute couture creation is being prepared with artisanal care by our master tailors.
          A confirmation dispatch has been delivered to your email.
        </p>

        {/* Order Details Badge Box */}
        <div className="bg-cream-50 border border-gold-500/20 p-6 text-left text-xs mb-8 space-y-3">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500 uppercase tracking-wider">Order Reference:</span>
            <span className="font-mono font-bold text-navy-950">{id}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500 uppercase tracking-wider">Tracking Code:</span>
            <span className="font-mono font-bold text-gold-700">
              {order?.trackingNumber || 'LUXE-' + Math.floor(10000000 + Math.random() * 90000000)}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500 uppercase tracking-wider">Estimated Dispatch:</span>
            <span className="font-semibold text-navy-950">1 - 2 Business Days via Express Courier</span>
          </div>

          <div className="flex justify-between pt-1">
            <span className="text-gray-500 uppercase tracking-wider">Order Status:</span>
            <span className="bg-navy-950 text-gold-300 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
              {order?.orderStatus || 'Processing'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile" className="btn-gold flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Track Order In Profile
          </Link>
          <Link to="/shop" className="btn-navy flex items-center justify-center gap-2">
            Continue Exploring
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
