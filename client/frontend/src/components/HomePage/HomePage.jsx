import { Link } from "react-router-dom";
import HomeCategories from "./HomeCategories";
import HomeProductTrending from "./HomeProductTrending";
import { ArrowRight, Sparkles, Truck, Zap } from "lucide-react";

const offers = [
  {
    title: "End of Season Sale",
    description: "Up to 70% off on top fashion brands",
    href: "/",
    icon: <Sparkles size={16} />,
    bg: "bg-orange-500",
  },
  {
    title: "Free Shipping",
    description: "On orders above ₹999. No hidden charges.",
    href: "/",
    icon: <Truck size={16} />,
    bg: "bg-emerald-500",
  },
  {
    title: "New Arrivals",
    description: "Fresh drops for men & women – shop the latest trends",
    href: "/",
    icon: <Zap size={16} />,
    bg: "bg-violet-500",
  },
];

const tickerItems = [
  "New Season Arrivals", "✦", "Free Shipping on ₹999+", "✦",
  "Up to 70% Off — Limited Time", "✦", "Exclusive Members Access", "✦",
  "New Season Arrivals", "✦", "Free Shipping on ₹999+", "✦",
  "Up to 70% Off — Limited Time", "✦", "Exclusive Members Access", "✦",
];

export default function Home() {
  return (
    <div className="bg-stone-100 font-sans overflow-x-hidden">

      {/* TICKER */}
      <div className="bg-neutral-900 py-2.5 overflow-hidden whitespace-nowrap">
        <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
        <div style={{ animation: "ticker 28s linear infinite" }} className="inline-flex gap-16">
          {tickerItems.map((item, i) => (
            <span key={i} className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${item === "✦" ? "text-amber-400" : "text-white/60"}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* OFFER PILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100 bg-white border-b border-neutral-100">
        {offers.map((offer, i) => (
          <Link key={i} to={offer.href} className="flex items-center gap-4 px-8 py-5 hover:bg-stone-50 transition-colors duration-200 no-underline">
            <div className={`${offer.bg} w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0`}>
              {offer.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">{offer.title}</p>
              <p className="text-xs text-neutral-400 leading-relaxed mt-0.5">{offer.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[88vh]">

        {/* Text */}
        <div className="flex items-center bg-stone-100 px-10 sm:px-16 lg:px-20 py-20 order-2 lg:order-1">
          <div className="max-w-lg w-full">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-amber-500 block"></span>
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-amber-500">SS 2025 Collection</span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-neutral-900 leading-[1.05] mb-6 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              Style that<br />
              <span className="italic text-rose-500">speaks</span><br />
              for itself
            </h1>

            <p className="text-base text-neutral-500 font-light leading-relaxed max-w-sm mb-10">
              Curated fashion from the world's finest labels — delivered to your door with unmatched care.
            </p>

            <div className="flex items-center gap-6 flex-wrap mb-14">
              <Link to="/products-filters" className="inline-flex items-center gap-2.5 bg-neutral-900 text-white text-[11px] font-bold tracking-[0.15em] uppercase px-9 py-4 hover:bg-rose-500 transition-colors duration-200 no-underline">
                Explore Now <ArrowRight size={15} />
              </Link>
              <Link to="/all-categories" className="text-[11px] font-semibold tracking-wider uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-rose-500 hover:border-rose-500 transition-colors no-underline">
                View Lookbook
              </Link>
            </div>

            <div className="flex gap-10 pt-10 border-t border-neutral-200">
              {[{ num: "2.4K+", label: "Products" }, { num: "180+", label: "Brands" }, { num: "98%", label: "Satisfaction" }].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-neutral-900 leading-none" style={{ fontFamily: "'Georgia', serif" }}>{s.num}</div>
                  <div className="text-[10px] tracking-[0.14em] uppercase text-neutral-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden order-1 lg:order-2 h-64 sm:h-80 lg:h-auto">
          <img src="/images/male-tailor.jpg" loading="lazy" alt="Male tailor" className="w-full h-full object-cover object-center" />
          <div className="absolute bottom-8 left-0 bg-white pl-6 pr-8 py-4 shadow-2xl border-l-4 border-amber-500">
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-500 mb-1">Limited Offer</div>
            <div className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "'Georgia', serif" }}>Up to 70% Off</div>
          </div>
        </div>
      </div>

      {/* SALE BAND */}
      <div className="relative bg-neutral-900 py-24 px-6 text-center overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-[200px] font-black text-white opacity-[0.03] pointer-events-none select-none whitespace-nowrap" style={{ fontFamily: "'Georgia', serif" }}>
          SALE
        </span>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400 mb-4">One-Time Exclusive</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5" style={{ fontFamily: "'Georgia', serif" }}>
            Get <span className="italic text-amber-400">25% off</span> during our<br className="hidden sm:block" /> once-a-season sale
          </h2>
          <p className="text-white/50 text-base font-light leading-relaxed max-w-md mx-auto mb-9">
            Limited releases that won't come back. Get your favorite items while they're still in stock.
          </p>
          <a href="#" className="inline-flex items-center gap-3 bg-amber-500 text-neutral-900 text-[11px] font-bold tracking-[0.18em] uppercase px-11 py-4 hover:opacity-90 transition-all duration-200 no-underline">
            Unlock the Offer <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[10px] font-bold tracking-[0.26em] uppercase text-amber-500 mb-2">Discover</div>
              <h2 className="text-4xl font-black text-neutral-900 leading-none" style={{ fontFamily: "'Georgia', serif" }}>Shop by Category</h2>
            </div>
            <Link to="/all-categories" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-rose-500 hover:border-rose-500 transition-colors no-underline">
              All Categories <ArrowRight size={14} />
            </Link>
          </div>
          <HomeCategories />
        </div>
      </div>

      {/* TRENDING */}
      <div className="bg-white">
        <HomeProductTrending />
      </div>

    </div>
  );
}