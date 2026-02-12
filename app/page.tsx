import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // 1. Petición a Supabase para traer productos con su URL de imagen
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error al cargar productos: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* --- SECCIÓN HERO --- */}
      <header className="py-20 px-4 text-center border-b border-gray-50">
        <h1 className="text-6xl font-black tracking-tighter uppercase text-black italic">
          RVRS <span className="text-red-600">COLLECTION</span>
        </h1>
        <p className="mt-4 text-gray-400 uppercase tracking-[0.3em] text-xs">
          Essentials for the modern rebel
        </p>
      </header>

      {/* --- GRID DE PRODUCTOS --- */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          
          {products?.map((product) => (
            <Link 
              href={`/producto/${product.slug}`} 
              key={product.id}
              className="group flex flex-col"
            >
              {/* CONTENEDOR DE IMAGEN DINÁMICA */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-6">
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 uppercase text-xs tracking-widest">
                    Imagen no disponible
                  </div>
                )}
                
                {/* Badge de diseño */}
                <div className="absolute top-4 left-4 bg-black text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
                  Limited
                </div>
              </div>

              {/* INFORMACIÓN DEL PRODUCTO */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-lg font-bold text-black uppercase tracking-tight">
                    {product.name}
                  </h2>
                  <span className="text-red-600 font-medium">
                    ${product.base_price}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-1 uppercase tracking-tighter">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-black border-t border-gray-100 mt-4 group-hover:text-red-600 transition-colors">
                  Explorar diseño 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </section>
    </main>
  );
}