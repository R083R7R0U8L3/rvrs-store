import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. Desenvolvemos los parámetros (Requisito Next.js 15)
  const { slug } = await params;

  // 2. Buscamos el producto, sus variantes y la nueva columna image_url
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
    `)
    .eq('slug', slug)
    .single();

  // Si hay error o el producto no existe, mandamos a la página 404
  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* COLUMNA IZQUIERDA: IMAGEN */}
          <div className="relative aspect-[3/4] bg-gray-50 dark:bg-neutral-900 overflow-hidden group">
            {product.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.name}
                fill
                priority // Carga esta imagen de inmediato (LCP optimization)
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 uppercase tracking-widest text-xs">
                Sin imagen disponible
              </div>
            )}
            
            {/* Overlay sutil de marca */}
            <div className="absolute bottom-6 left-6 text-white/20 dark:text-white/10 font-black text-4xl pointer-events-none uppercase italic">
              RVRS
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO Y COMPRA */}
          <div className="flex flex-col justify-center">
            <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Tienda</Link>
              <span className="mx-2">/</span>
              <span className="text-black dark:text-white font-bold">{product.name}</span>
            </nav>

            <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-4">
              {product.name}
            </h1>
            
            <p className="text-2xl font-light text-red-600 dark:text-red-500 mb-8">
              ${product.base_price}
            </p>

            <div className="prose prose-sm text-gray-500 dark:text-gray-400 mb-10 border-l-2 border-black dark:border-white pl-6 transition-colors">
              <p>{product.description}</p>
            </div>

            {/* COMPONENTE INTERACTIVO (CLIENT SIDE) */}
            <AddToCartButton 
              product={product} 
            />

            {/* INFO EXTRA DE CONFIANZA */}
            <div className="mt-12 grid grid-cols-2 gap-4 pt-8 border-t border-gray-100 dark:border-neutral-800 transition-colors">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-black dark:text-white">Envío</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500">Entrega en 2-4 días hábiles.</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-black dark:text-white">Garantía</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500">Devoluciones gratis por 30 días.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
