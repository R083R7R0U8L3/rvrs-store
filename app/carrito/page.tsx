'use client';

import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  
  // Estado para los datos del cliente
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    // Validación básica
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Por favor, completa todos los datos para el envío.");
      return;
    }

    try {
      // 1. Guardar el pedido en la base de datos de Supabase
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: customer.name,
          customer_phone: customer.phone,
          address: customer.address,
          total_amount: total,
          items: cart 
        }
      ]);

      if (error) throw error;

      // 2. Preparar el mensaje para WhatsApp
      const itemsList = cart.map(i => `- ${i.name} (${i.size}) x${i.quantity}`).join('%0A');
      const message = `🚀 *NUEVO PEDIDO RVRS*%0A%0A` +
                      `*Cliente:* ${customer.name}%0A` +
                      `*Tel:* ${customer.phone}%0A` +
                      `*Dirección:* ${customer.address}%0A%0A` +
                      `*Productos:*%0A${itemsList}%0A%0A` +
                      `*TOTAL:* $${total.toFixed(2)}`;

      // Reemplaza el número abajo con el tuyo (incluye código de país, ej: 521...)
      const whatsappUrl = `https://wa.me/593979060750?text=${message}`;

      // 3. Abrir WhatsApp y finalizar flujo
      window.open(whatsappUrl, '_blank');
      clearCart();
      router.push('/carrito/success');

    } catch (error) {
      console.error("Error al procesar pedido:", error);
      alert("Hubo un error al procesar tu pedido. Intenta de nuevo.");
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-6 text-black">Tu carrito está vacío</h1>
        <Link href="/" className="bg-black text-white px-10 py-4 uppercase text-[10px] font-black tracking-[0.2em] hover:bg-red-600 transition-colors">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-12 px-4 md:py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 italic text-black">
          Tu <span className="text-red-600">Carrito</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LISTA DE PRODUCTOS (COL 7) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 flex flex-col sm:flex-row items-center gap-6 border-2 border-gray-100">
                <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-black uppercase tracking-tight text-lg">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                    Talla: {item.size} | {item.color}
                  </p>
                  <p className="font-bold text-red-600 mt-4 text-lg">${item.price}</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center border-2 border-black">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 font-black">-</button>
                    <span className="px-4 text-sm font-black min-w-[40px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 font-black">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-600">Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          {/* DATOS Y RESUMEN (COL 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50 p-8 border-t-8 border-black shadow-xl">
              <h2 className="font-black uppercase mb-6 tracking-[0.2em] text-sm">Datos de Envío</h2>
              
              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  placeholder="NOMBRE COMPLETO"
                  className="w-full p-4 text-[11px] font-bold border-2 border-white focus:border-black outline-none transition-all uppercase"
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="WHATSAPP (Ej: +52...)"
                  className="w-full p-4 text-[11px] font-bold border-2 border-white focus:border-black outline-none transition-all"
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                />
                <textarea 
                  placeholder="DIRECCIÓN COMPLETA DE ENTREGA"
                  className="w-full p-4 text-[11px] font-bold border-2 border-white focus:border-black outline-none transition-all h-24 uppercase"
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                />
              </div>

              <div className="border-t-2 border-gray-200 pt-6 mb-8 space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black uppercase tracking-tighter text-black">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-5 font-black uppercase text-[12px] tracking-[0.3em] hover:bg-red-600 transition-all shadow-lg"
              >
                Confirmar y Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}