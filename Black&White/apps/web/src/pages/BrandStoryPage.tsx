import React from 'react';
import { Link } from 'react-router-dom';


export const BrandStoryPage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-24">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center border-b border-zinc-800">
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop"
          alt="Atelier Heritage"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.4em]">Our Legacy</span>
          <h1 className="text-4xl md:text-7xl font-serif font-black uppercase tracking-tight mt-2 mb-4">
            The Heritage of Black & White
          </h1>
          <p className="text-zinc-300 font-light text-base md:text-lg tracking-wider uppercase">
            Where Masterful Tailoring Meets Modern Distinction
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl mt-16 space-y-16">
        <div className="space-y-6 text-zinc-300 font-light text-base leading-relaxed">
          <h2 className="text-3xl font-serif font-bold uppercase text-white tracking-wider border-b border-zinc-800 pb-4">
            1. The Monochromatic Philosophy
          </h2>
          <p>
            Black & White was founded on a singular, uncompromising conviction: true luxury requires no ostentation. By stripping away extraneous noise and focusing exclusively on monochromatic perfection, we distill men’s tailoring down to its elemental soul—silhouettes, structure, and fiber purity.
          </p>
          <p>
            Every garment begins in our Milanese design house, where master patternmakers spend months perfecting lapel curvature, shoulder pitch, and chest canvas drape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded bg-zinc-950 border border-zinc-800 space-y-4">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Fiber Integrity</span>
            <h3 className="text-2xl font-serif font-bold uppercase text-white">Rare & Certified Raw Materials</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              We source exclusively from GOTS-certified organic cotton farms in the West Indies, shuttle-loom selvedge mills in Okayama, and historic wool spinners in Biella, Italy.
            </p>
          </div>

          <div className="p-8 rounded bg-zinc-950 border border-zinc-800 space-y-4">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Artisanal Craft</span>
            <h3 className="text-2xl font-serif font-bold uppercase text-white">Hand-Stitched Execution</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              From hand-bound buttonholes to floating horsehair chest pieces, our garments are built to endure generations.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-zinc-800">
          <Link
            to="/shop"
            className="px-10 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.25em] hover:bg-amber-400 transition-colors"
          >
            Explore The Current Collection &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandStoryPage;
