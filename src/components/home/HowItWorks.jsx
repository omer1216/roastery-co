import { ClipboardList, Coffee, Bike, ShoppingBag } from "lucide-react";

const STEPS = [
  {
    id: "order",
    title: "Order",
    body: "Pick your drink, set the size and milk, checkout in under a minute.",
    Icon: ClipboardList,
  },
  {
    id: "made",
    title: "Made to order",
    body: "Nothing is pre-pulled. The bar starts your drink when the ticket lands.",
    Icon: Coffee,
  },
  {
    id: "route",
    title: "On the way",
    body: "Delivery across Blue Area and nearby sectors, usually inside 25 minutes.",
    Icon: Bike,
  },
  {
    id: "collect",
    title: "Or collect",
    body: "Pickup orders wait at the end of the bar. Give the order number.",
    Icon: ShoppingBag,
  },
];

export default function HowItWorks() {
  return (
    <section className=" border-y border-white/5 bg-roastery-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {STEPS.map(({ id, title, body, Icon }) => (
          <div key={id} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-roastery-accent/25 text-roastery-accent-text">
              <Icon size={19} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-heading text-base text-roastery-text">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-roastery-muted">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}