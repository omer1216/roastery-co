import Link from "next/link";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import CartButton from "./cart/CartButton";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-roastery-panel/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-lg font-medium tracking-tight text-roastery-text transition-opacity hover:opacity-80"
        >
          The Roastery Co.
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
          <CartButton />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <CartButton />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}