'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product, variants }: any) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const handleAdd = () => {
    if (!selectedVariant) return;

    addToCart({
      id: selectedVariant.id,
      name: product.name,
      price: product.base_price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      image_url: product.image_url, // Pasamos la imagen al contexto
      quantity: 1
    });
    
    alert(`¡${product.name} añadido al carrito!`);
  };

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold uppercase mb-4 text-black">Talla</h3>
      <div className="flex flex-wrap gap-3 mb-8">
        {variants.map((v: any) => (
          <button
            key={v.id}
            onClick={() => setSelectedVariant(v)}
            className={`min-w-[60px] py-3 px-4 text-sm font-bold border-2 transition-all
              ${selectedVariant?.id === v.id ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}
          >
            {v.size}
          </button>
        ))}
      </div>

      <button 
        onClick={handleAdd}
        className="w-full bg-black text-white py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all"
      >
        Añadir al Carrito
      </button>
    </div>
  );
}