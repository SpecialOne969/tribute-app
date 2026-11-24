"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryGridProps {
  images: string[];
  initialCount?: number;
}

export default function GalleryGrid({ images, initialCount = 8 }: GalleryGridProps) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? images : images.slice(0, initialCount);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {visible.map((src) => (
          <div
            key={src}
            className="group relative overflow-hidden rounded-xl aspect-square border border-neutral-800 hover:border-gold/40 transition-colors duration-300"
          >
            <Image
              src={src}
              alt="Cherished memory"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {images.length > initialCount && (
        <div className="text-center mt-10">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-2 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200"
          >
            {expanded ? (
              <>
                Show Less
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                View More ({images.length - initialCount} more photos)
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
