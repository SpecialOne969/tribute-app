import Image from "next/image";
import Navigation from "@/components/Navigation";
import TributeSection from "@/components/TributeSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import GalleryGrid from "@/components/GalleryGrid";

const BASE = "/Dir wife";

// 5 images for the auto-advancing carousel
const carouselImages = [
  { src: "/619257.jpg",                           caption: "In Ministry" },
  { src: "/619258.jpg",                           caption: "A Life of Service" },
  { src: "/620469.jpg",                           caption: "Moments of Grace" },
  { src: `${BASE}/IMG-20261124-WA0006.jpg`,       caption: "Cherished Moments" },
  { src: `${BASE}/IMG-20261124-WA0007.jpg`,       caption: "Cherished Moments" },
  { src: `${BASE}/IMG-20261124-WA0008.jpg`,       caption: "Cherished Moments" },
  { src: `${BASE}/IMG-20261124-WA0009.jpg`,       caption: "Cherished Moments" },
  { src: `${BASE}/IMG-20261124-WA0010.jpg`,       caption: "Cherished Moments" },
];

// All remaining Dir wife photos for the full gallery grid
const photoGallery = [
  "WA0011","WA0012","WA0013","WA0014","WA0015","WA0016","WA0017","WA0018","WA0019","WA0020",
  "WA0021","WA0022","WA0023","WA0024","WA0025","WA0026","WA0027","WA0028","WA0029","WA0030",
  "WA0031","WA0032","WA0033","WA0034","WA0035","WA0036","WA0037","WA0038","WA0039","WA0040",
  "WA0041","WA0042","WA0043","WA0044","WA0045","WA0046","WA0047","WA0048","WA0049","WA0050",
  "WA0051","WA0052","WA0053","WA0054","WA0057","WA0058","WA0059","WA0060",
  "WA0061","WA0062","WA0064","WA0065","WA0066","WA0067",
].map((id) => `${BASE}/IMG-20261124-${id}.jpg`);

export default function Home() {
  return (
    <>
      <Navigation />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/619257.jpg"
            alt="Pastor Mrs I.V. Olori"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/65" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
          <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-2 border-gold shadow-2xl shadow-gold/30">
            <Image src="/619257.jpg" alt="Pastor Mrs I.V. Olori" fill className="object-cover object-top" />
          </div>

          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">
            In Honour Of
          </p>

          <h1 className="font-display font-bold leading-tight mb-5 drop-shadow-lg">
            <span className="block text-4xl sm:text-6xl md:text-7xl text-white">
              Pastor Mrs
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl text-gold mt-1">
              I.V. Olori
            </span>
          </h1>

          <p className="text-neutral-300 italic text-base md:text-lg mb-4">
            Greater Evangelism World Crusade
          </p>

          <p className="text-neutral-300 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Share your tribute, testimony, and words of remembrance for a
            servant of God whose life and ministry have been a blessing to so many.
          </p>

          <div className="flex justify-center">
            <a
              href="#tributes"
              className="bg-gold hover:bg-gold-bright text-black font-bold py-3.5 px-9 rounded-full text-base transition-all hover:scale-105 hover:shadow-xl hover:shadow-gold/25"
            >
              Leave a Tribute
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-neutral-400 text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">
            A Life of Service
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            A Legacy of Faith &amp; Dedication
          </h2>
          <div className="w-24 h-0.5 bg-gold mx-auto rounded-full mb-10" />

          <p className="text-neutral-300 text-lg leading-relaxed mb-6">
            Pastor Mrs I.V. Olori has been a faithful servant of God within
            Greater Evangelism World Crusade (GEWC). She was a loving wife, a devoted
            mother, a spiritual mother to many, and a tremendous blessing to the Church
            and the body of Christ. While her departure has created an irreplaceable
            vacuum in our hearts and in the Ministry, we take solace in the assurance
            of God&apos;s Word:
          </p>
          <blockquote className="border-l-4 border-gold pl-6 my-8 text-left max-w-2xl mx-auto">
            <p className="text-gold italic text-xl leading-relaxed">
              &ldquo;Precious in the sight of the LORD is the death of his saints.&rdquo;
            </p>
            <cite className="text-neutral-500 text-sm mt-3 block not-italic">
              — Psalm 116:15 (KJV)
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ── CAROUSEL GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Photo Gallery
            </span>
            <h2 className="font-display text-4xl font-bold text-white mt-3">
              Moments of Glory
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-5 rounded-full" />
          </div>
          <GalleryCarousel images={carouselImages} />
        </div>
      </section>

      {/* ── FULL PHOTO GALLERY ───────────────────────────────────────── */}
      <section id="photos" className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Memories
            </span>
            <h2 className="font-display text-4xl font-bold text-white mt-3">
              Cherished Memories
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-5 rounded-full" />
            <p className="text-neutral-400 mt-5 text-sm">
              A collection of precious moments from her life and ministry.
            </p>
          </div>

          <GalleryGrid images={photoGallery} initialCount={8} />
        </div>
      </section>

      {/* ── TRIBUTE SECTION ──────────────────────────────────────────── */}
      <TributeSection />

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-neutral-950 border-t border-neutral-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/40 flex-shrink-0">
                  <Image src="/619257.jpg" alt="Pastor Mrs I.V. Olori" fill className="object-cover object-top" />
                </div>
                <span className="font-bold text-base text-white">Pastor Mrs I.V. Olori</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                A tribute to Pastor Mrs I.V. Olori
              </p>
            </div>

            <div>
              <h4 className="text-gold font-bold uppercase tracking-wider text-xs mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "#home",    label: "Home" },
                  { href: "#about",   label: "About" },
                  { href: "#gallery", label: "Gallery" },
                  { href: "#photos",  label: "Photos" },
                  { href: "#tributes",label: "Tributes" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-neutral-500 hover:text-gold transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-6 text-center text-neutral-700 text-xs">
            &copy; 2026 Greater Evangelism World Crusade. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
