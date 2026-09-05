import Link from "next/link";
import Image from "next/image";
import RotatingWord from "./RotatingWord";

export default function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 text-center sm:pt-32">
        <p className="animate-fade-up text-xs uppercase tracking-[0.25em] text-roastery-muted">
          Specialty Coffee &amp; Tea
        </p>

        <h1 className="animate-fade-up delay-100 mx-auto mt-6 max-w-3xl font-heading text-4xl leading-tight text-roastery-text sm:text-6xl">
          Coffee, <RotatingWord />{" "}made
        </h1>

        <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-roastery-muted">
          Small-batch roasting, a proper South Asian tea program, and pastry
          baked in-house every morning.
        </p>

        <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/menu"
            className="rounded-full bg-roastery-accent px-7 py-3 text-sm font-medium text-roastery-bg transition-colors duration-200 hover:bg-roastery-accent-text"
          >
            Order now
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-roastery-muted/30 px-7 py-3 text-sm font-medium text-roastery-text transition-colors duration-200 hover:border-roastery-accent/50 hover:text-roastery-accent-text"
          >
            View menu
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-fade-up delay-400 relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-roastery-panel sm:aspect-[21/9]">
          <Image
            src="/images/hero.jpg"
            alt="The Roastery Co. counter and bar seating"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}