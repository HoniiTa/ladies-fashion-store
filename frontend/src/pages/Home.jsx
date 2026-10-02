import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Star,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featData, arrivalsData, catData] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new-arrivals'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(featData || []);
        setNewArrivals(arrivalsData || []);
        setCategories(catData || []);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-[#FDFBF7]">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-navy-950">
        {/* Background image with dramatic overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
            alt="Luxe Ladies Haute Couture"
            className="w-full h-full object-cover object-top opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-gold-500/40 bg-navy-900/60 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[11px] font-medium tracking-[0.25em] text-gold-300 uppercase">
                Autumn / Winter 2026 Haute Couture
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Elegance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4E5BD] via-[#D4AF37] to-[#DFBA73]">
                That Defines You
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-10 max-w-xl font-light">
              Discover opulent evening gowns, royal embroidered abayas, luminous mulberry silk
              hijabs, and fine jewelry. Crafted with unwavering commitment to modest luxury and
              artisanal poise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-gold flex items-center justify-center gap-2">
                Explore The Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="btn-navy flex items-center justify-center gap-2">
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Luxury Value Pillars */}
      <section className="bg-navy-900 text-gold-200 border-y border-gold-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-6 h-6 text-gold-400 mb-2" />
              <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-white">
                Complimentary Shipping
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">On all orders over $150</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-6 h-6 text-gold-400 mb-2" />
              <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-white">
                Mulberry Silk & Pure Gold
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Finest certified textiles</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-6 h-6 text-gold-400 mb-2" />
              <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-white">
                Effortless 30-Day Returns
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">White-glove return concierge</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-gold-400 mb-2" />
              <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-white">
                Couture Guarantee
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Authenticity verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-2">
            Curated Boutiques
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mb-3">
            Shop By Signature Category
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[3/4] overflow-hidden bg-navy-950 shadow-md block border border-gray-200 hover:border-gold-500 transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent transition-opacity group-hover:opacity-80" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gold-400 uppercase tracking-widest mt-1 opacity-90">
                  {cat.productCount ? `${cat.productCount} Creations` : 'Explore Boutique'} &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Haute Couture */}
      <section className="py-16 bg-cream-100 border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
                Handpicked Masterpieces
              </span>
              <h2 className="font-serif text-3xl font-bold text-navy-950">
                Featured Haute Couture
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-navy-950 hover:text-gold-600 flex items-center gap-1 group"
            >
              <span>View All Featured</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Spotlight Banner */}
      <section className="py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold-400 font-semibold block mb-4">
                The Atelier Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-6">
                The Art of Modest <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4E5BD] via-[#D4AF37] to-[#DFBA73]">
                  Gilded Splendor
                </span>
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                At Luxe Ladies, every seam is an homage to timeless grace. We combine
                centuries-old embroidery techniques with modern silhouettes, ensuring you step
                into every gala, gathering, and soirée enveloped in sheer luxury.
              </p>
              <div className="flex items-center gap-8 mb-8 text-gold-300">
                <div>
                  <span className="font-serif text-3xl font-bold text-white block">100%</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Pure Mulberry Silk
                  </span>
                </div>
                <div className="h-10 w-[1px] bg-gold-500/30" />
                <div>
                  <span className="font-serif text-3xl font-bold text-white block">24K</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Gold Bullion Threads
                  </span>
                </div>
                <div className="h-10 w-[1px] bg-gold-500/30" />
                <div>
                  <span className="font-serif text-3xl font-bold text-white block">5★</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Artisan Rating
                  </span>
                </div>
              </div>
              <Link to="/about" className="btn-gold inline-flex items-center gap-2">
                Discover Our Heritage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden border-2 border-gold-500/40 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
                  alt="Luxe Atelier Silk Dress"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-navy-950/90 border border-gold-500/30 backdrop-blur-sm">
                  <p className="font-serif text-base text-gold-200 font-semibold">
                    The Empress Silk Collection
                  </p>
                  <p className="text-[11px] text-gray-300 mt-1">
                    Exclusively handcrafted in our Paris atelier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-1">
              Fresh Off The Runway
            </span>
            <h2 className="font-serif text-3xl font-bold text-navy-950">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?category=New%20Arrivals"
            className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-navy-950 hover:text-gold-600 flex items-center gap-1 group"
          >
            <span>Explore All New Pieces</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. Client Testimonials */}
      <section className="py-20 bg-cream-50 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block mb-2">
              Client Acclaim
            </span>
            <h2 className="font-serif text-3xl font-bold text-navy-950 mb-3">
              Words From Our Clientele
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-100 shadow-sm relative">
              <div className="flex text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="font-serif italic text-sm text-gray-700 leading-relaxed mb-6">
                “The Midnight Silk Gown is the finest evening piece I own. The weight, drape, and
                opulent gold embroidery turned every head at the Met Gala afterparty.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-100 border border-gold-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Sophia Laurent"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-navy-950">Sophia Laurent</h4>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Beverly Hills, CA</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-gray-100 shadow-sm relative">
              <div className="flex text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="font-serif italic text-sm text-gray-700 leading-relaxed mb-6">
                “Luxe Ladies embodies modest fashion with an uncompromising standard of high
                haute couture. The Royal Noor Abaya feels like a precious family heirloom.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-100 border border-gold-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                    alt="Farah Al-Mansoor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-navy-950">Farah Al-Mansoor</h4>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Dubai, UAE</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-gray-100 shadow-sm relative">
              <div className="flex text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="font-serif italic text-sm text-gray-700 leading-relaxed mb-6">
                “The Mulberry Silk Hijabs are sheer poetry. The sheen is subtle, they hold shape
                effortlessly, and the hand-rolled gold edges showcase real artisan pedigree.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-100 border border-gold-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
                    alt="Elena Rostova"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-navy-950">Elena Rostova</h4>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">London, UK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
