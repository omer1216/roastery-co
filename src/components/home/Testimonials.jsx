const TESTIMONIALS = [
  {
    id: "hira-a",
    quote:
      "I order the karak twice a week and it's identical every single time. That sounds like a small thing. It isn't, in this city.",
    author: "Hira A.",
    context: "Regular since 2022",
  },
  {
    id: "daniyal-k",
    quote:
      "Asked what the pour-over was that morning and got a five minute answer about the farm. Slightly more than I needed, but you can tell they care.",
    author: "Daniyal K.",
    context: "Google review",
  },
  {
    id: "samina-r",
    quote:
      "Fourteen drinks for an office meeting, all customised, all labelled correctly. Delivery got there before I did.",
    author: "Samina R.",
    context: "Office order, F-7",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
        What people say
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <figure
            key={item.id}
            className="flex flex-col rounded-2xl border border-white/5 bg-roastery-panel p-8 transition duration-300 hover:-translate-y-1 hover:border-roastery-accent/30 hover:shadow-lg hover:shadow-black/50"
          >
            <blockquote className="flex-1 text-base leading-relaxed text-roastery-text">
              {item.quote}
            </blockquote>
            <figcaption className="mt-7 border-t border-white/5 pt-5">
              <p className="text-sm text-roastery-text">{item.author}</p>
              <p className="mt-1 text-xs text-roastery-muted">{item.context}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}