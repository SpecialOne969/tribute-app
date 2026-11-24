"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about",   label: "About" },
    { href: "#gallery", label: "Gallery" },
    { href: "#photos",  label: "Photos" },
    { href: "#tributes",label: "Tributes" },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold/50 group-hover:border-gold transition-colors flex-shrink-0">
            <Image src="/619257.jpg" alt="Pastor Mrs Blessing I.V. Olori" fill className="object-cover object-top" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide hidden sm:block">Pastor Mrs Blessing I.V. Olori</span>
          <span className="text-white font-bold text-sm tracking-wide sm:hidden">Pst. Blessing I.V. Olori</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-neutral-300 hover:text-gold transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tributes"
            className="bg-gold hover:bg-gold-bright text-black font-bold px-5 py-2 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            Leave a Tribute
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-neutral-300 hover:text-gold p-2 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-950/98 backdrop-blur-md border-t border-neutral-800 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-neutral-300 hover:text-gold transition-colors font-medium py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tributes"
            onClick={() => setMenuOpen(false)}
            className="bg-gold hover:bg-gold-bright text-black font-bold px-5 py-2.5 rounded-full text-sm text-center transition-colors"
          >
            Leave a Tribute
          </a>
        </div>
      )}
    </nav>
  );
}
