import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-black text-white rounded-full flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Pedido <span className="text-red-600">Confirmado</span>
        </h1>
        
        <p className="text-gray-500 uppercase text-xs tracking-[0.2em] leading-relaxed">
          Gracias por confiar en RVRS. Hemos recibido tu orden y estamos preparando tus prendas esenciales. Recibirás un correo pronto.
        </p>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-block bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}