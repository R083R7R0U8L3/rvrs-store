'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  slug: string;
  image_url?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;
        // Nos aseguramos de asignar un arreglo siempre
        setProducts(data || []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* SECCIÓN HERO / TITULAR */}
      <section className="text-center py-16 md:py-24 px-4 border-b border-gray-100 dark:border-neutral-900">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic">
          RVRS <span className="text-red-600">COLLECTION</span>
        </h1>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
          Essentials for the modern rebel
        </p>
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-gray-100 dark:bg-neutral-900 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <div 
                key={product?.id || Math.random()}
                className="group relative bg-gray-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 p-4 transition-all duration-300 hover:shadow-2xl dark:hover:border-neutral-700 flex flex-col justify-between"
              >
                <div>
                  {/* Contenedor de la Imagen */}
                  <div className="relative w-full h-80 bg-gray-200 dark:bg-neutral-800 overflow-hidden mb-4">
                    <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-black uppercase px-2 py-1 tracking-widest">
                      LIMITED
                    </span>
                    {product?.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product?.name || 'Producto'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400 uppercase font-bold">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* Info de producto */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-black dark:text-white">
                      {product?.name || 'Producto sin nombre'}
                    </h3>
                    <span className="font-bold text-red-600 text-lg">
                      ${product?.base_price ?? 0}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                    {product?.description || ''}
                  </p>
                </div>

                {/* Acciones */}
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <Link 
                    href={`/producto/${product?.slug || ''}`}
                    className="block text-center w-full bg-transparent border-2 border-black dark:border-white text-black dark:text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    Ver Detalles
                  </Link>

                  {product && <AddToCartButton product={product} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}