import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact | The Roastery Co.",
  description:
    "Hours, location and enquiries. Beverly Centre, Blue Area, Islamabad.",
};

const HOURS = [
  { id: "weekdays", days: "Monday – Thursday", time: "7:30am – 11:00pm" },
  { id: "weekend", days: "Friday – Sunday", time: "7:30am – 1:00am" },
];

const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=Beverly+Centre+Blue+Area+Islamabad";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
          Contact
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight text-roastery-text sm:text-5xl">
          Where to find us
        </h1>
      </header>

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-12">
          <section>
            <h2 className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
              Address
            </h2>
            <address className="mt-5 space-y-1 text-lg not-italic leading-relaxed text-roastery-text">
              <p>Beverly Centre, Jinnah Avenue</p>
              <p>Blue Area, Islamabad 44000</p>
            </address>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-roastery-accent-text transition-colors hover:text-roastery-text"
            >
              Get directions
            </a>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
              Hours
            </h2>
            <dl className="mt-5 space-y-3">
              {HOURS.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between gap-6 border-b border-white/5 pb-3 text-sm"
                >
                  <dt className="text-roastery-muted">{entry.days}</dt>
                  <dd className="text-roastery-text">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
              Direct
            </h2>
            <div className="mt-5 space-y-2 text-sm">
              <p>
                <a
                  href="tel:+925112345678"
                  className="text-roastery-text transition-colors hover:text-roastery-accent-text"
                >
                  +92 51 234 5678
                </a>
              </p>
              <p>
                <a
                  href="mailto:hello@theroasteryco.pk"
                  className="text-roastery-text transition-colors hover:text-roastery-accent-text"
                >
                  hello@theroasteryco.pk
                </a>
              </p>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-roastery-muted">
              For catering, wholesale beans, or private hire, use the form and
              someone will come back to you within a working day.
            </p>
          </section>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}