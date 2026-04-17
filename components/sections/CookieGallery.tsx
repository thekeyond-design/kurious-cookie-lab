"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export interface CookieGalleryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  color: string;
}

export interface CookieGalleryProps {
  title?: string;
  description?: string;
  items: CookieGalleryItem[];
}

/* ─── Atomic orbital SVG decoration ──────────────────────────────────────── */
function AtomDecoration() {
  return (
    <svg
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.07] hidden lg:block"
      width="520"
      height="520"
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nucleus */}
      <circle cx="260" cy="260" r="12" fill="#4DAEEA" />
      <circle cx="260" cy="260" r="6"  fill="#3EC9C9" />
      {/* Orbit 1 — horizontal */}
      <ellipse cx="260" cy="260" rx="220" ry="70" stroke="#4DAEEA" strokeWidth="1.5" />
      {/* Orbit 2 — 60° */}
      <ellipse cx="260" cy="260" rx="220" ry="70" stroke="#3EC9C9" strokeWidth="1.5" transform="rotate(60 260 260)" />
      {/* Orbit 3 — 120° */}
      <ellipse cx="260" cy="260" rx="220" ry="70" stroke="#4DAEEA" strokeWidth="1.5" transform="rotate(120 260 260)" />
      {/* Electron dots */}
      <circle cx="480" cy="260" r="6" fill="#4DAEEA" />
      <circle cx="150" cy="143" r="6" fill="#3EC9C9" />
      <circle cx="150" cy="377" r="6" fill="#4DAEEA" />
      <circle cx="40"  cy="260" r="4" fill="#3EC9C9" opacity="0.5" />
      <circle cx="370" cy="143" r="4" fill="#4DAEEA" opacity="0.5" />
      <circle cx="370" cy="377" r="4" fill="#3EC9C9" opacity="0.5" />
    </svg>
  )
}

const CookieGallery = ({
  title = "Our Highlighted Elements",
  description = "A selection of our most-loved cookie formulas. Batched to order, made fresh for you.",
  items,
}: CookieGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => { carouselApi.off("select", updateSelection); };
  }, [carouselApi]);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#0e1525" }}>

      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(77,174,234,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(77,174,234,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Atom decoration */}
      <AtomDecoration />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest text-[#4DAEEA]"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Fresh From the Lab
            </span>
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span
                className="text-[#FF3DA0]"
                style={{ fontFamily: "var(--font-script)", fontWeight: 400, fontSize: "1.1em" }}
              >
                {title.split(" ").slice(-1)[0]}
              </span>
            </h2>
            <p className="max-w-md text-white/45 text-base">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="w-10 h-10 rounded-full border-2 border-white/15 flex items-center justify-center text-white/50
                         hover:border-[#4DAEEA] hover:text-[#4DAEEA] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="w-10 h-10 rounded-full border-2 border-white/15 flex items-center justify-center text-white/50
                         hover:border-[#4DAEEA] hover:text-[#4DAEEA] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem key={item.id} className="max-w-[300px] pl-[20px] lg:max-w-[340px]">
                <a href={item.href} className="group block rounded-2xl">
                  <div
                    className="group relative h-full min-h-[26rem] max-w-full overflow-hidden rounded-2xl md:aspect-[5/4] lg:aspect-[16/9]"
                    style={{ boxShadow: `0 4px 32px ${item.color}25, 0 0 0 1px ${item.color}20` }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 300px, 340px"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full"
                        style={{ background: `linear-gradient(145deg, ${item.color} 0%, ${item.color}bb 100%)` }}
                      >
                        <div className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-white/20 font-extrabold text-8xl select-none"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {item.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Gradient + colored bottom glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 opacity-40 transition-opacity duration-300 group-hover:opacity-60"
                      style={{ background: `linear-gradient(to top, ${item.color}60, transparent)` }}
                    />

                    {/* Element symbol top-left */}
                    <div
                      className="absolute top-3 left-3 w-9 h-9 rounded-lg border-2 flex items-center justify-center text-xs font-extrabold"
                      style={{
                        borderColor: `${item.color}80`,
                        background: "rgba(0,0,0,0.5)",
                        color: item.color,
                        fontFamily: "var(--font-display)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {item.id}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6">
                      <div
                        className="mb-1.5 text-xl font-bold text-white"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </div>
                      <div className="mb-6 text-sm text-white/65 line-clamp-2 leading-relaxed">
                        {item.description}
                      </div>
                      <div
                        className="flex items-center text-sm font-semibold transition-colors"
                        style={{
                          fontFamily: "var(--font-oswald)",
                          letterSpacing: "0.05em",
                          color: item.color,
                        }}
                      >
                        Order Now
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === index ? "w-6" : "bg-white/20 w-1.5"
              }`}
              style={currentSlide === index ? { background: "#4DAEEA", width: "24px" } : {}}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { CookieGallery };
