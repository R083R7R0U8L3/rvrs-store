'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted && Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    : 0;

  return (
    <Link href="/carrito" className="relative flex items-center">
      <span className="text-xl">🛒</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}