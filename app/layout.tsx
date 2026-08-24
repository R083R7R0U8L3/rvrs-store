import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore CSS side-effect imports are handled by Next.js.
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/components/CartIcon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RVRS | Store",
  description: "Diseño minimalista y calidad excepcional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            {/* --- NAVEGACIÓN GLOBAL --- */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors duration-300">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* Logo botón principal de la marca RVRS */}
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/logo.png" 
                    alt="RVRS Logo" 
                    width={120} 
                    height={40} 
                    className="h-8 w-auto object-contain dark:invert" 
                    priority 
                  />
                </Link>

                {/* Enlaces, Switch Modo Oscuro y Carrito */}
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-sm font-medium hover:text-red-600 transition-colors">
                    Tienda
                  </Link>
                  <ThemeToggle />
                  <CartIcon />
                </div>
              </div>
            </nav>

            {/* --- CONTENIDO DE LAS PÁGINAS --- */}
            {children}

            {/* --- PIE DE PÁGINA --- */}
            <footer className="bg-black text-white dark:bg-neutral-950 py-12 px-4 mt-20 border-t border-transparent dark:border-neutral-800">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                  <h4 className="font-bold uppercase mb-4 tracking-widest text-red-600">RVRS</h4>
                  <p className="text-gray-400 text-sm">Elevando lo esencial a través del diseño.</p>
                </div>
                <div>
                  <h4 className="font-bold uppercase mb-4 tracking-widest">Ayuda</h4>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>Envíos</li>
                    <li>Devoluciones</li>
                    <li>Contacto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold uppercase mb-4 tracking-widest">Síguenos</h4>
                  <p className="text-gray-400 text-sm">Instagram / TikTok</p>
                </div>
              </div>
              <div className="text-center text-gray-600 text-[10px] mt-12 pt-8 border-t border-gray-800 uppercase tracking-widest">
                © 2026 RVRS Store - Todos los derechos reservados
              </div>
            </footer>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}