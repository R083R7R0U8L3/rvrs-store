'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Evita desajustes de hidratación en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = (cart || []).reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-12 px-4 md:py-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 italic">
          Tu <span className="text-red-600">Carrito</span>
        </h1>

        {!cart || cart.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 dark:border-neutral-800 p-8 rounded-lg">
            <p className="text-lg font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
              Tu carrito está vacío
            </p>
            <Link
              href="/"
              className="inline-block bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
            >
              Explorar Tienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LISTA DE PRODUCTOS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 transition-colors"
                >
                  {/* IMAGEN DEL PRODUCTO */}
                  <div className="relative w-24 h-24 bg-gray-200 dark:bg-neutral-800 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image_url || '/logo.png'}
                      alt={item.name || 'Producto'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* INFO DEL PRODUCTO */}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-black uppercase text-base tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mt-1">
                      Talla: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm font-bold text-red-600 mt-2">
                      ${item.price}
                    </p>
                  </div>

                  {/* CANTIDAD Y ELIMINAR */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 dark:border-neutral-700">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 font-bold hover:bg-gray-200 dark:hover:bg-neutral-800"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 font-bold hover:bg-gray-200 dark:hover:bg-neutral-800"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-gray-400 hover:text-red-600 font-bold uppercase transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors pt-4"
              >
                Vaciar Carrito
              </button>
            </div>

            {/* RESUMEN DE COMPRA */}
            <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-6 h-fit space-y-6">
              <h2 className="font-black uppercase text-xl tracking-tight pb-4 border-b border-gray-200 dark:border-neutral-800">
                Resumen
              </h2>

              <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">Envío</span>
                  <span className="font-bold text-green-600 uppercase text-xs">Gratis</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-neutral-800 text-lg font-black">
                  <span className="uppercase">Total</span>
                  <span className="text-red-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block text-center w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
              >
                Finalizar Compra
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}