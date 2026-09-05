import MenuBrowser from "@/components/menu/MenuBrowser";
import { getMenuItems } from "@/lib/menu";

export const revalidate = 60;

export const metadata = {
  title: "Menu | The Roastery Co.",
  description:
    "Specialty coffee, South Asian tea, signature drinks and small-batch bakery.",
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
          Menu
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight text-roastery-text sm:text-5xl">
          Everything we make
        </h1>
        <p className="mt-6 text-base leading-relaxed text-roastery-muted">
          Coffee roasted in small batches, tea taken as seriously as the coffee,
          and pastry baked in-house each morning. Sizes and milk are yours to
          choose at checkout.
        </p>
      </header>

      <MenuBrowser items={items} />
    </div>
  );
}