'use client';

import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  base_price: number;
  image_url?: string;
  product_variants?: Array<{
    id: string;
    size: string;
    color: string;
  }>;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    // Usamos optional chaining y valores por defecto seguros
    const variant = product?.product_variants?.[0] || { size: 'M', color: 'Negro' };

    addToCart({
      id: product?.id || Math.random().toString(),
      name: product?.name || 'Producto',
      price: product?.base_price || 0,
      image_url: product?.image_url || '',
      size: variant?.size || 'M',
      color: variant?.color || 'Negro',
      quantity: 1,
    });

    alert('¡Producto añadido al carrito!');
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-black dark:bg-white text-white dark:text-black py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
    >
      Añadir al Carrito
    </button>
  );
}