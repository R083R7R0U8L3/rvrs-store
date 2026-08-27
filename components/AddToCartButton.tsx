'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface Variant {
  id: string;
  size: string;
  color: string;
  sku?: string;
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
  const [showToast, setShowToast] = useState(false);
  
  // Obtenemos las variantes de Supabase o un respaldo por defecto
  const variants = product?.product_variants || [];
  
  const availableSizes = variants.length > 0 
    ? variants.map(v => v.size) 
    : ['S', 'M', 'L', 'XL', 'XXL'];

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'M');

  const handleAdd = () => {
    const currentVariant = variants.find(v => v.size === selectedSize);
    const finalColor = currentVariant?.color || 'Dual blanco y negro';

    addToCart({
      id: product?.id || Math.random().toString(),
      name: product?.name || 'Producto',
      price: product?.base_price || 0,
      image_url: product?.image_url || '',
      size: selectedSize,
      color: finalColor,
      quantity: 1,
    });

    // Activamos la notificación flotante (Toast)
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Se oculta automáticamente en 3 segundos
  };

  return (
    <div className="space-y-8 mt-8 relative">
      {/* NOTIFICACIÓN FLOTANTE TIPO MENSAJE */}
      {showToast && (
        <div className="absolute -top-16 right-0 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest px-4 py-3 shadow-2xl transition-all duration-300 animate-bounce z-50 flex items-center gap-2 border border-neutral-800 dark:border-neutral-200">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          ¡Producto agregado exitosamente!
        </div>
      )}

      {/* Selector de Tallas */}
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
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
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

      {/* Botón Añadir */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
      >
        Añadir al Carrito
      </button>
    </div>
  );
}