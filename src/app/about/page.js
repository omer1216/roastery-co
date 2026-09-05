import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | The Roastery Co.",
  description:
    "A specialty coffee bar in Blue Area, Islamabad, with a proper South Asian tea program.",
};

const PRINCIPLES = [
  {
    id: "sourcing",
    title: "Single origin, named farms",
    body: "We buy from three importers who publish what they pay growers. The origin on the pour-over board changes every few weeks and we'll tell you exactly where it came from.",
  },
  {
    id: "roasting",
    title: "Roasted here, in small batches",
    body: "Twelve kilos at a time, twice a week, in the room behind the bar. Nothing on the shelf is more than ten days off the roaster.",
  },
  {
    id: "tea",
    title: "Tea, not an afterthought",
    body: "Loose leaf weighed per cup, karak boiled down properly rather than steeped, real saffron in the qehwa. The tea menu gets the same attention as the espresso.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
          About
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight text-roastery-text sm:text-5xl">
          A specialty coffee bar with a proper South Asian tea program
        </h1>
      </header>

      <div className="mt-16 grid items-start gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-roastery-panel">
          <Image
            src="/images/story.jpg"
            alt="Roasting green coffee in the back of house"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-5 text-base leading-relaxed text-roastery-muted">
          <p>
            The Roastery Co. opened in Blue Area in 2019 with one secondhand
            roaster, six seats, and a menu short enough to fit on a single
            board. The idea was narrow on purpose. Do coffee properly, in a city
            where properly was hard to find.
          </p>
          <p>
            The problem showed up within a month. Half the people walking in
            wanted chai, and every specialty bar we had worked in treated that
            as a compromise. A teabag in hot milk, handed over apologetically.
          </p>
          <p>
            That never made sense to us. The care that goes into a pour-over is
            the same care a good karak needs, and there is no reason a room can
            only be serious about one of them. So the tea program got its own
            recipes, its own sourcing, and its own space on the bar.
          </p>
          <p>
            Six years on, the espresso and the chai sell in roughly equal
            numbers. Both sides of the counter are the point.
          </p>
        </div>
      </div>

      <section className="mt-28">
        <h2 className="font-heading text-3xl text-roastery-text sm:text-4xl">
          How we work
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.id}
              className="rounded-2xl border border-white/5 bg-roastery-panel p-8"
            >
              <h3 className="font-heading text-lg text-roastery-text">
                {principle.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-roastery-muted">
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-28 rounded-2xl border border-white/5 bg-roastery-panel px-8 py-14 text-center sm:px-16">
        <h2 className="mx-auto max-w-xl font-heading text-3xl leading-snug text-roastery-text">
          Come sit down, or have it sent over
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-roastery-muted">
          The bar is open from half seven every morning. Delivery runs across
          Blue Area and the surrounding sectors.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/menu"
            className="rounded-full bg-roastery-accent px-7 py-3 text-sm font-medium text-roastery-bg transition-colors duration-200 hover:bg-roastery-accent-text"
          >
            Order now
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-roastery-muted/30 px-7 py-3 text-sm font-medium text-roastery-text transition-colors duration-200 hover:border-roastery-accent/50 hover:text-roastery-accent-text"
          >
            Find us
          </Link>
        </div>
      </section>
    </div>
  );
}