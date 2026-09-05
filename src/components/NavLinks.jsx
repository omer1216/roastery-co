"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavLinks({ onNavigate, variant = "desktop" }) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <ul className="flex flex-col gap-5">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`text-base transition-colors ${
                  isActive
                    ? "text-roastery-accent-text"
                    : "text-roastery-muted hover:text-roastery-text"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative py-1 text-sm transition-colors duration-200 ${
                isActive
                  ? "text-roastery-text"
                  : "text-roastery-muted hover:text-roastery-text"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-roastery-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "w-full" : "w-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}