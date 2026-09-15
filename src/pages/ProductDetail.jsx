import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../firebase/products";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { formatNaira } from "../utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(undefined); // undefined = loading, null = not found
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    let active = true;
    fetchProduct(id).then((p) => active && setProduct(p));
    return () => {
      active = false;
    };
  }, [id]);

  if (product === undefined) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-ink/50">Loading…</div>;
  }

  if (product === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-ink/60 mb-4">We couldn't find that dish.</p>
        <Link to="/menu" className="text-jollof hover:underline">
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/menu" className="text-sm text-ink/50 hover:text-jollof">
        ← Back to menu
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="aspect-square rounded-2xl bg-ink/5 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 font-display">
              Photo coming soon
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-palm-dark mb-2">{product.category}</p>
          <h1 className="font-display text-3xl mb-3">{product.name}</h1>
          {product.description && <p className="text-ink/60 mb-6">{product.description}</p>}
          <p className="font-display text-2xl text-jollof mb-6">
            {formatNaira(product.price, settings.currencySymbol)}
          </p>

          {!product.available ? (
            <p className="text-sm bg-ink/5 text-ink/60 rounded-full px-4 py-2 inline-block">
              Currently out of stock
            </p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-ink/15 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addItem(product, quantity)}
                className="bg-jollof text-cream px-6 py-3 rounded-full font-medium hover:bg-jollof-dark transition-colors"
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}