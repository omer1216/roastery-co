import Link from "next/link";
import MenuImage from "@/components/MenuImage";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/lib/format";

export default function SignaturePicks({ items }) {
  if (!items?.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
            Signature picks
          </p>
          <h2 className="mt-4 font-heading text-3xl text-roastery-text sm:text-4xl">
            What people order twice
          </h2>
        </div>
        <Link
          href="/menu"
          className="shrink-0 text-sm text-roastery-accent-text transition-colors hover:text-roastery-text"
        >
          View full menu
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 90} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-roastery-panel transition duration-300 hover:-translate-y-1 hover:border-roastery-accent/30 hover:shadow-lg hover:shadow-black/50">
              <div className="relative aspect-square w-full overflow-hidden bg-roastery-bg">
                <MenuImage
                  src={item.image_url}
                  alt={item.name}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-baseline justify-between gap-3 p-5">
                <h3 className="font-heading text-base text-roastery-text">
                  {item.name}
                </h3>
                <p className="shrink-0 text-sm text-roastery-accent-text">
                  {formatPrice(item.price)}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}