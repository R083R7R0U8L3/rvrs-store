'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase'; // <-- Importamos Supabase
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga al enviar

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cityOption: 'Quito',
    customCity: '',
    address: '',
    phone: '',
    paymentMethod: 'contra_entrega',
  });

  const subtotal = (cart || []).reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  const shippingCost = formData.cityOption === 'Quito' ? 0 : 5.00;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      // 1. Preparamos los datos a enviar a Supabase
      const finalCity = formData.cityOption === 'Quito' ? 'Quito' : formData.customCity;
      
      const orderPayload = {
        customer_name: formData.name,
        email: formData.email || null,
        city: finalCity,
        address: formData.address,
        phone: formData.phone,
        payment_method: formData.paymentMethod,
        total: total,
        items: cart, // Guarda el array completo de productos en formato JSON
      };

      // 2. Insertamos en la tabla 'orders'
      const { error } = await supabase
        .from('orders')
        .insert([orderPayload]);

      if (error) throw error;

      // 3. Si todo sale bien, vaciamos carrito y mostramos éxito
      setSubmitted(true);
      clearCart();
    } catch (error) {
      console.error('Error al guardar el pedido en Supabase:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-20 px-4 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-md w-full text-center space-y-6 border border-gray-200 dark:border-neutral-800 p-8 rounded">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-red-600">¡Pedido Exitoso!</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
            Gracias por tu compra en RVRS. Hemos registrado tu pedido en nuestra base de datos. Nos pondremos en contacto contigo pronto.
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
          >
            Volver a la Tienda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-12 px-4 md:py-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 italic">
          Finalizar <span className="text-red-600">Compra</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* FORMULARIO DE ENVÍO Y PAGO */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Información de Envío
            </h2>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Nombre Completo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">
                Correo Electrónico <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* SELECCIÓN DE CIUDAD */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Ciudad de Destino</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cityOption: 'Quito', customCity: '' })}
                  className={`py-3 text-xs font-bold uppercase border transition-all ${
                    formData.cityOption === 'Quito'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-200 dark:border-neutral-800 text-gray-500 hover:border-black dark:hover:border-white'
                  }`}
                >
                  Quito (Envío Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cityOption: 'Otra' })}
                  className={`py-3 text-xs font-bold uppercase border transition-all ${
                    formData.cityOption === 'Otra'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-200 dark:border-neutral-800 text-gray-500 hover:border-black dark:hover:border-white'
                  }`}
                >
                  Otra Ciudad
                </button>
              </div>

              {formData.cityOption === 'Otra' && (
                <div>
                  <input
                    type="text"
                    required
                    value={formData.customCity}
                    onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                    placeholder="Especifica tu ciudad..."
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Dirección de Entrega</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                placeholder="Calle principal, numeración y referencias"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Teléfono de Contacto</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                placeholder="0991234567"
              />
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Método de Pago</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'contra_entrega' })}
                  className={`py-3 text-xs font-bold uppercase border transition-all ${
                    formData.paymentMethod === 'contra_entrega'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-200 dark:border-neutral-800 text-gray-500 hover:border-black dark:hover:border-white'
                  }`}
                >
                  Pago Contra Entrega
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'transferencia' })}
                  className={`py-3 text-xs font-bold uppercase border transition-all ${
                    formData.paymentMethod === 'transferencia'
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-200 dark:border-neutral-800 text-gray-500 hover:border-black dark:hover:border-white'
                  }`}
                >
                  Transferencia
                </button>
              </div>

              {formData.paymentMethod === 'transferencia' && (
                <div className="p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="font-bold text-black dark:text-white uppercase tracking-wider mb-1">Datos bancarios:</p>
                  <p>Banco Pichincha</p>
                  <p>Tipo: Cuenta Ahorros - 2205651325</p>
                  <p>Celular: 0979060750</p>
                  <p className="text-[10px] text-red-500 mt-2">* Envíanos el comprobante por WhatsApp para confirmar.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white disabled:opacity-50 transition-colors mt-6"
            >
              {loading ? 'Procesando...' : `Confirmar Pedido ($${total.toFixed(2)})`}
            </button>
          </form>

          {/* RESUMEN DEL PEDIDO */}
          <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-6 h-fit space-y-6">
            <h2 className="font-black uppercase text-xl tracking-tight pb-4 border-b border-gray-200 dark:border-neutral-800">
              Resumen del Pedido
            </h2>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold uppercase block">{item.name}</span>
                    <span className="text-gray-400">Talla: {item.size} | Cant: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-red-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase text-xs font-bold">Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase text-xs font-bold">Envío</span>
                <span className={`font-bold uppercase text-xs ${shippingCost === 0 ? 'text-green-600' : 'text-black dark:text-white'}`}>
                  {shippingCost === 0 ? 'Gratis (Quito)' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase text-xs font-bold">Método de pago</span>
                <span className="font-bold text-xs uppercase">
                  {formData.paymentMethod === 'contra_entrega' ? 'Contra Entrega' : 'Transferencia'}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-neutral-800 text-lg font-black">
                <span className="uppercase">Total</span>
                <span className="text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}