'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface Variant {
  id: string;
  size: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  base_price: number;
  image_url?: string;
  product_variants?: Variant[];
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  // Extraemos las variantes únicas de talla de la base de datos
  const uniqueSizes = Array.from(
    new Set((product?.product_variants || []).map(v => v.size))
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    uniqueSizes.length > 0 ? uniqueSizes[0] : 'M'
  );

  const handleAdd = () => {
    // Buscamos la variante completa correspondiente a la talla seleccionada
    const variant = (product?.product_variants || []).find(v => v.size === selectedSize) 
      || product?.product_variants?.[0] 
      || { size: selectedSize, color: 'Negro' };

    addToCart({
      id: product?.id || Math.random().toString(),
      name: product?.name || 'Producto',
      price: product?.base_price || 0,
      image_url: product?.image_url || '',
      size: variant.size,
      color: variant.color,
      quantity: 1,
    });

    alert(`¡Producto (Talla: ${selectedSize}) añadido al carrito!`);
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Selector de Tallas */}
      {uniqueSizes.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
              Talla Seleccionada: {selectedSize}
            </span>
            <span className="text-[10px] text-gray-400 underline cursor-pointer hover:text-black dark:hover:text-white transition-colors">
              Guía de tallas
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {uniqueSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-14 h-12 flex items-center justify-center text-xs font-bold transition-all ${
                  selectedSize === size
                    ? 'border-2 border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border border-gray-200 text-gray-600 hover:border-black dark:border-neutral-800 dark:text-gray-400 dark:hover:border-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-red-500 font-bold uppercase">Sin stock disponible</p>
      )}

      {/* Botón Añadir */}
      <button
        onClick={handleAdd}
        disabled={uniqueSizes.length === 0}
        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Añadir al Carrito
      </button>
    </div>
  );
}