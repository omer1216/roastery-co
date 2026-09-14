import Image from "next/image";
import Link from "next/link";

export default function StoryStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 ">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-roastery-panel">
          <Image
            src="/images/story.jpg"
            alt="Roasting green coffee in the back of house"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
            Our story
          </p>
          <h2 className="mt-5 font-heading text-3xl leading-snug text-roastery-text sm:text-4xl">
            A specialty coffee bar with a proper South Asian tea program
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-roastery-muted">
            <p>
              We opened in 2019 with one roaster and a short menu. The coffee
              was always the point, but half of Islamabad walks in wanting chai,
              and most specialty bars treat that as an afterthought.
            </p>
            <p>
              So the tea program got the same treatment as the coffee. Karak
              boiled down properly, Kashmiri chai whisked to colour, qehwa with
              real saffron. Both sides of the bar are taken seriously.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-block text-sm text-roastery-accent-text transition-colors hover:text-roastery-text"
          >
            More about us
          </Link>
        </div>
      </div>
    </section>
  );
}