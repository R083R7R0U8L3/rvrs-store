'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 uppercase">Tu carrito está vacío</h1>
        <Link href="/" className="bg-black text-white px-8 py-3 uppercase text-xs font-bold">Volver</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black uppercase mb-8">Tu Carrito</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                {/* IMAGEN DEL PRODUCTO */}
                <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                  <Image 
                    src={item.image_url} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold uppercase tracking-tight">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase">Talla: {item.size} | {item.color}</p>
                  <p className="font-bold text-red-600 mt-2">${item.price}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center border border-gray-200">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 font-bold">-</button>
                    <span className="px-4 text-sm font-bold min-w-[40px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-gray-400 uppercase hover:text-red-600">Eliminar</button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-[10px] text-gray-400 uppercase tracking-widest mt-4">Vaciar Carrito</button>
          </div>

          <div className="bg-white p-6 shadow-md h-fit">
            <h2 className="font-black uppercase mb-6 tracking-widest border-b pb-4">Resumen</h2>
            <div className="space-y-4 mb-6 text-sm uppercase">
              <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-green-600 font-bold">Envío Gratis</span></div>
              <div className="flex justify-between text-xl font-black border-t pt-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button className="w-full bg-black text-white py-4 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 transition-colors">Finalizar Compra</button>
          </div>
        </div>
      </div>
    </main>
  );
}
