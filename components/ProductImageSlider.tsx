'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface SliderProps {
  images: string[];
  productName: string;
}

export default function ProductImageSlider({ images, productName }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Referencias para calcular el deslizamiento con el dedo (Swipe)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50; // Mínimo de pixeles para considerar un deslizamiento

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 dark:bg-neutral-900 flex items-center justify-center text-xs text-gray-400">
        Sin imagen
      </div>
    );
  }

  return (
    <div 
      className="relative group w-full aspect-[3/4] bg-gray-50 dark:bg-neutral-900 overflow-hidden touch-pan-y select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Contenedor deslizable */}
      <div 
        className="flex w-full h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative">
            <Image 
              src={img} 
              alt={`${productName} vista ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover pointer-events-none"
            />
            {idx === 0 && (
              <div className="absolute bottom-6 left-6 text-white/20 dark:text-white/10 font-black text-4xl pointer-events-none uppercase italic z-10">
                RVRS
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flechas de navegación (computadora) */}
      <button 
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 text-black dark:text-white w-10 h-10 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white dark:hover:bg-black border border-transparent dark:border-neutral-700"
      >
        ←
      </button>
      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 text-black dark:text-white w-10 h-10 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white dark:hover:bg-black border border-transparent dark:border-neutral-700"
      >
        →
      </button>

      {/* Puntitos indicadores estilo Instagram */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 dark:bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}