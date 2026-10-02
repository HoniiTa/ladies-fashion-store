import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 border border-gold-500/40 bg-white">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-navy-950 font-semibold">
              The Maison Heritage
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-navy-950 mb-6">
            Elegance That Defines You
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
            Founded with an unwavering vision to redefine women’s modest haute couture, Luxe Ladies
            creates timeless silhouettes that celebrate inner poise, artistic reverence, and pure
            opulence.
          </p>
          <div className="w-20 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="aspect-[4/5] bg-navy-950 overflow-hidden border-2 border-gold-500/30 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"
              alt="Maison Craftsmanship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-navy-950/90 border border-gold-500/30">
              <span className="font-serif text-gold-300 text-sm font-bold block">
                The Paris & Dubai Ateliers
              </span>
              <span className="text-[11px] text-gray-300">
                Where master embroiderers spend up to 120 hours on a single creation.
              </span>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold block">
              The Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-navy-950">
              Where Modesty Meets Uncompromising Opulence
            </h2>
            <p>
              We believe elegance should never require compromise. True luxury is found in the
              fluidity of hand-spun Mulberry silk, the weight of custom-forged 18k gold hardware,
              and the dignified lines of a masterfully tailored silhouette.
            </p>
            <p>
              From royal banquets in Dubai to evening galas in London and New York, Luxe Ladies
              dresses discerning women across the globe who appreciate the quiet power of modesty
              fused with couture craftsmanship.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <h4 className="font-serif text-lg font-bold text-navy-950 mb-1">
                  Artisanal Integrity
                </h4>
                <p className="text-xs text-gray-500">
                  Ethically sourced Grade 6A silk, organic breathable modal, and heavy gold bullion.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-navy-950 mb-1">
                  Bespoke Perfection
                </h4>
                <p className="text-xs text-gray-500">
                  Hand-finished hems, reinforced seams, and immaculate attention to drape.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="bg-navy-950 text-white p-12 sm:p-16 border border-gold-500/30 mb-20 shadow-luxury">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold-400 font-semibold block mb-2">
              Our Commitments
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              The Three Pillars of Luxe Ladies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy-900/60 border border-gold-500/20 p-8 text-center space-y-4">
              <Award className="w-8 h-8 text-gold-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-gold-200">
                Peerless Materials
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                We travel from Kyoto to Lyon to secure the world's most opulent natural fibres,
                ensuring breathability, rich drape, and lasting longevity.
              </p>
            </div>

            <div className="bg-navy-900/60 border border-gold-500/20 p-8 text-center space-y-4">
              <ShieldCheck className="w-8 h-8 text-gold-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-gold-200">
                Ethical Atelier Production
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                Our master artisans are celebrated, respected, and compensated well above industry
                standards in fair, serene atelier workshops.
              </p>
            </div>

            <div className="bg-navy-900/60 border border-gold-500/20 p-8 text-center space-y-4">
              <Heart className="w-8 h-8 text-gold-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-gold-200">
                Empowered Grace
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                Every garment is crafted to bestow confidence, composure, and timeless royalty upon
                the woman who wears it.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Experience The Collection
          </Link>
        </div>
      </div>
    </div>
  );
};
