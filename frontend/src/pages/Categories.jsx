import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((data) => setCategories(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-gold-500/40 bg-white">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-navy-950 font-semibold">
              The Department Directory
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy-950 mb-4">
            Curated Categories
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-light">
            Every department reflects our commitment to exceptional tailoring, pure silk textiles,
            and regal finishing touches.
          </p>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
            <span className="font-serif uppercase tracking-widest text-xs text-gray-500">
              Gathering Collections...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-luxury hover:border-gold-500/60 transition-all duration-500 flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden bg-cream-100 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {cat.productCount > 0 && (
                    <span className="absolute top-3 right-3 bg-navy-950/90 text-gold-300 text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 border border-gold-500/30">
                      {cat.productCount} Items
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-navy-950 group-hover:text-gold-600 transition-colors mb-2">
                      {cat.name}
                    </h2>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed font-light mb-4">
                      {cat.description || `Discover exquisite creations in our ${cat.name} collection.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-navy-950 group-hover:text-gold-600 font-semibold tracking-wider uppercase">
                    <span>Explore Department</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
