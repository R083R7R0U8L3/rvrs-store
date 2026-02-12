'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartIcon() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/carrito" className="relative p-2 group">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-6 h-6 group-hover:text-brand-accent transition-colors text-brand-black"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.112 16.825a.75.75 0 0 1-.743.818H3.025a.75.75 0 0 1-.743-.818L3.394 8.507a.75.75 0 0 1 .743-.682H20.02a.75.75 0 0 1 .743.682Z" />
      </svg>

      {/* BURBUJA DE NOTIFICACIÓN*/}
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-md animate-in fade-in zoom-in duration-300">
          {totalItems}
        </span>
      )}
    </Link>
  );
}