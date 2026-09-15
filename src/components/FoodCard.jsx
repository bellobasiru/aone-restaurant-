import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { formatNaira } from "../utils/format";

export default function FoodCard({ product }) {
  const { addItem } = useCart();
  const { settings } = useSettings();

  return (
    <div className="group border border-ink/10 rounded-2xl overflow-hidden bg-white flex flex-col">
      <Link to={`/menu/${product.id}`} className="block aspect-[4/3] bg-ink/5 overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm">
            Photo coming soon
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gold text-cream text-xs px-2.5 py-1 rounded-full font-medium">
            Featured
          </span>
        )}
        {!product.available && (
          <span className="absolute top-3 right-3 bg-ink/80 text-cream text-xs px-2.5 py-1 rounded-full font-medium">
            Out of stock
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-palm-dark mb-1">{product.category}</p>
        <Link to={`/menu/${product.id}`} className="font-display text-lg leading-snug mb-1 hover:text-jollof">
          {product.name}
        </Link>
        {product.description && (
          <p className="text-sm text-ink/60 line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg text-jollof">
            {formatNaira(product.price, settings.currencySymbol)}
          </span>
          <button
            onClick={() => addItem(product, 1)}
            disabled={!product.available}
            className="text-sm bg-palm text-cream px-4 py-2 rounded-full hover:bg-palm-dark transition-colors disabled:bg-ink/20 disabled:cursor-not-allowed"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}