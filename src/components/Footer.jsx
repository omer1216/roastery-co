import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/omershahzad_1411/", Icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100010832975728", Icon: FacebookIcon },
];

const MENU_LINKS = [
  { label: "Coffee", href: "/menu" },
  { label: "Tea", href: "/menu" },
  { label: "Specialty drinks", href: "/menu" },
  { label: "Bakery", href: "/menu" },
];

const COMPANY_LINKS = [
  { label: "Our story", href: "/about" },
  { label: "Visit us", href: "/contact" },
  { label: "Wholesale beans", href: "/contact" },
  { label: "Catering", href: "/contact" },
];

const HOURS = [
  { id: "weekdays", days: "Mon – Thu", time: "7:30am – 11:00pm" },
  { id: "weekend", days: "Fri – Sun", time: "7:30am – 1:00am" },
];

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 bg-roastery-panel">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <p className="font-heading text-xl text-roastery-text">
              The Roastery Co.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-roastery-muted">
              Specialty coffee, a proper South Asian tea program, and pastry
              baked in-house each morning. Blue Area, since 2019.
            </p>

            <div className="mt-7 flex gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-roastery-muted/20 p-2.5 text-roastery-muted transition-colors duration-200 hover:border-roastery-accent/40 hover:text-roastery-accent-text"
                >
                  <Icon width={17} height={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-roastery-muted">
              Menu
            </p>
            <ul className="mt-5 space-y-3">
              {MENU_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-roastery-muted transition-colors hover:text-roastery-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-roastery-muted">
              The shop
            </p>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-roastery-muted transition-colors hover:text-roastery-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-roastery-muted">
              Find us
            </p>

            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-roastery-muted"
                />
                <span className="text-roastery-muted">
                  Beverly Centre, Jinnah Avenue
                  <br />
                  Blue Area, Islamabad
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-roastery-muted" />
                <a
                  href="tel:+925112345678"
                  className="text-roastery-muted transition-colors hover:text-roastery-text"
                >
                  +92 51 234 5678
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-roastery-muted" />
                <a
                  href="mailto:mosfyp@gmail.com"
                  className="text-roastery-muted transition-colors hover:text-roastery-text"
                >
                  hello@theroasteryco.pk
                </a>
              </li>
            </ul>

            <dl className="mt-6 space-y-2">
              {HOURS.map((entry) => (
                <div key={entry.id} className="flex justify-between gap-4 text-sm">
                  <dt className="text-roastery-muted">{entry.days}</dt>
                  <dd className="text-roastery-text">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-roastery-muted/60">
            © {new Date().getFullYear()} The Roastery Co. All rights reserved.
          </p>
          <p className="text-xs text-roastery-muted/60">
            Delivery across Blue Area and surrounding sectors
          </p>
        </div>
      </div>
    </footer>
  );
}