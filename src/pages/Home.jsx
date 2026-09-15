import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToProducts } from "../firebase/products";
import { useSettings } from "../context/SettingsContext";
import FoodCard from "../components/FoodCard";

const BENEFITS = [
  { title: "Made fresh, daily", body: "Every pot is cooked to order from ingredients sourced around Jos." },
  { title: "Fast in and out", body: "Dine-in, takeaway, or delivery — order ahead on WhatsApp and skip the wait." },
  { title: "Real Nigerian flavour", body: "Jollof, swallow, pepper soup, and combos made the way you actually want them." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const { settings } = useSettings();

  useEffect(() => {
    const unsubscribe = subscribeToProducts(setProducts, () => setProducts([]));
    return unsubscribe;
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const popular = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-jollof/[0.06] to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-5">
              Welcome to {settings.brandName}
            </h1>
            <p className="text-lg text-ink/70 mb-2">{settings.slogan}</p>
            <p className="text-ink/60 mb-8 max-w-md">
              Enjoy delicious Nigerian meals, fast food, drinks, and special tea
              at {settings.brandName}, Jos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="bg-jollof text-cream px-7 py-3 rounded-full font-medium hover:bg-jollof-dark transition-colors"
              >
                Order Now
              </Link>
              <Link
                to="/menu"
                className="border border-ink/20 px-7 py-3 rounded-full font-medium hover:border-ink/50 transition-colors"
              >
                View Menu
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-2xl bg-jollof/10 flex items-center justify-center text-jollof/50 font-display">
              Jollof Rice
            </div>
            <div className="aspect-square rounded-2xl bg-palm/10 flex items-center justify-center text-palm/60 font-display mt-8">
              Pepper Soup
            </div>
            <div className="aspect-square rounded-2xl bg-gold/10 flex items-center justify-center text-gold/70 font-display">
              Combo Meal
            </div>
            <div className="aspect-square rounded-2xl bg-ink/5 flex items-center justify-center text-ink/40 font-display mt-8">
              Special Tea
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="font-display text-2xl mb-6">Featured today</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <FoodCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Popular */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Popular right now</h2>
          <Link to="/menu" className="text-sm text-jollof hover:underline">
            See full menu
          </Link>
        </div>
        {popular.length === 0 ? (
          <p className="text-ink/50 text-sm">
            The menu will appear here as soon as products are added from the Admin Dashboard.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popular.map((p) => (
              <FoodCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="bg-palm/5 py-16 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-8">
          {BENEFITS.map((b) => (
            <div key={b.title}>
              <h3 className="font-display text-xl mb-2 text-palm-dark">{b.title}</h3>
              <p className="text-sm text-ink/60">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl mb-6">What customers say</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: "Chidinma O.", quote: "The jollof rice reminds me of home. Delivery to my office was quick." },
            { name: "Musa A.", quote: "Best pepper soup in Jos, hands down. WhatsApp ordering is so easy." },
            { name: "Grace T.", quote: "Combo meals are generous and the staff are always friendly." },
          ].map((r) => (
            <div key={r.name} className="border border-ink/10 rounded-2xl p-6 bg-white">
              <p className="text-ink/70 text-sm mb-4">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-sm font-medium">{r.name}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/40 mt-4">
          Sample reviews shown as placeholders — replace with real customer feedback from the Admin Dashboard.
        </p>
      </section>
    </div>
  );
}