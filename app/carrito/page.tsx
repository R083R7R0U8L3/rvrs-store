'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importamos el router para la redirección

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter(); // Inicializamos el router

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Función para manejar el checkout
  const handleCheckout = () => {
    // 1. Aquí se procesaría el pago en un entorno real
    // 2. Limpiamos el carrito (ya tenemos esta función en el Context)
    clearCart();
    // 3. Redirigimos a la página de éxito que creamos
    router.push('/carrito/success');
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">Tu carrito está vacío</h1>
        <Link 
          href="/" 
          className="bg-black text-white px-10 py-4 uppercase text-[10px] font-black tracking-[0.2em] hover:bg-red-600 transition-colors"
        >
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 italic">
          Tu <span className="text-red-600">Carrito</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LISTA DE PRODUCTOS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 flex flex-col sm:row items-center gap-6 shadow-sm border border-gray-100">
                {/* IMAGEN DINÁMICA */}
                <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[8px] uppercase text-gray-400">Sin foto</div>
                  )}
                </div>
                
                {/* INFO */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-black uppercase tracking-tight text-lg">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                    Talla: {item.size} <span className="mx-2 text-gray-200">|</span> {item.color}
                  </p>
                  <p className="font-bold text-red-600 mt-4 text-lg">${item.price}</p>
                </div>

                {/* CONTROLES */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center border-2 border-black">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      className="px-4 py-2 font-black hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-black min-w-[40px] text-center border-x-2 border-black">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="px-4 py-2 font-black hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Eliminar artículo
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={clearCart} 
              className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black transition-colors pt-4"
            >
              Vaciar carrito completo
            </button>
          </div>

          {/* RESUMEN DE PAGO */}
          <div className="bg-white p-8 shadow-xl border-t-4 border-black h-fit sticky top-8">
            <h2 className="font-black uppercase mb-8 tracking-[0.2em] text-sm border-b pb-4">Resumen de orden</h2>
            
            <div className="space-y-4 mb-10 text-[11px] uppercase font-bold tracking-widest">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between text-xl font-black border-t-2 border-gray-50 pt-6 text-black">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-5 font-black uppercase text-[11px] tracking-[0.3em] hover:bg-red-600 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              Finalizar Compra
            </button>
            
            <p className="text-[9px] text-center text-gray-400 uppercase mt-6 tracking-tighter">
              Pagos seguros procesados por la red RVRS
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}