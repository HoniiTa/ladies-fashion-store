import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-navy-950 text-gray-300 border-t border-gold-500/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600">
                LUXE LADIES
              </span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/70 -mt-1 font-light">
                Haute Couture & Modest Luxury
              </p>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Dedicated to crafting timeless elegance for the modern muse. Each creation embodies
              exceptional artisanal craftsmanship, fluid silks, and opulent gold accents designed
              to empower your distinctive grace.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-navy-950 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-navy-950 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-navy-950 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold-300 font-semibold mb-4 border-b border-gold-500/20 pb-1.5 inline-block">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=Dresses" className="hover:text-gold-400 transition-colors">
                  Evening Dresses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Abayas" className="hover:text-gold-400 transition-colors">
                  Royal Abayas
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Hijabs" className="hover:text-gold-400 transition-colors">
                  Mulberry Silk Hijabs
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Handbags" className="hover:text-gold-400 transition-colors">
                  Designer Handbags
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Jewelry" className="hover:text-gold-400 transition-colors">
                  18k Gold Jewelry
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shoes" className="hover:text-gold-400 transition-colors">
                  Stiletto Footwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold-300 font-semibold mb-4 border-b border-gold-500/20 pb-1.5 inline-block">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Boutique Concierge
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-gold-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gold-400 transition-colors">
                  Complimentary Shipping
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Bespoke Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold-300 font-semibold mb-4 border-b border-gold-500/20 pb-1.5 inline-block">
              The Salon Gazette
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Receive private invitations to runway previews and private trunk shows.
            </p>
            {subscribed ? (
              <div className="bg-gold-500/10 border border-gold-500/40 p-3 flex items-center gap-2 text-gold-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>You are cordially subscribed. Welcome to Luxe Ladies.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your private email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-navy-900 border border-gold-500/30 text-white placeholder-gray-500 text-xs px-3 py-2.5 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-gold py-2.5 text-[11px]"
                >
                  Join The Inner Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} LUXE LADIES. All Rights Reserved. Elegance That Defines You.</p>
          <div className="flex items-center space-x-6">
            <span>Secured with 256-bit SSL</span>
            <span>Worldwide Delivery</span>
            <span>Authentic Luxury Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
