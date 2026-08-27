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
  
  const variants = product?.product_variants || [];
  const availableSizes = variants.length > 0 
    ? variants.map(v => v.size) 
    : ['S', 'M', 'L', 'XL', 'XXL'];

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'M');
  const [showSuccess, setShowSuccess] = useState(false); // Estado para mostrar el aviso

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

    // Mostramos el aviso y lo ocultamos automáticamente a los 3 segundos
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 mt-8">
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

      {/* Botón de añadir y aviso sutil al lado/abajo */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleAdd}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
        >
          Añadir al Carrito
        </button>

        {/* Mensaje de aviso integrado en la interfaz */}
        {showSuccess && (
          <div className="p-3 bg-green-50 dark:bg-neutral-900 border border-green-200 dark:border-neutral-800 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider text-center animate-fadeIn transition-all">
            ✓ ¡Añadido al carrito (Talla: {selectedSize})!
          </div>
        )}
      </div>
    </div>
  );
}