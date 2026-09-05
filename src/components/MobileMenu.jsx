"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="text-roastery-text"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="animate-fade-in absolute left-0 right-0 top-16 border-b border-white/5 bg-roastery-panel px-6 py-6">
          <NavLinks variant="mobile" onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}