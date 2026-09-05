import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout | The Roastery Co.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-roastery-muted">
          Checkout
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight text-roastery-text sm:text-5xl">
          Almost done
        </h1>
      </header>

      <CheckoutForm />
    </div>
  );
}