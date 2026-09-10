"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { describeCustomizations, deliveryFeeFor } from "@/lib/cart";

const EMPTY = {
  name: "",
  phone: "",
  orderType: "pickup",
  address: "",
  notes: "",
};

const inputClasses =
  "w-full rounded-lg border border-roastery-muted/20 bg-roastery-bg px-4 py-3 text-sm text-roastery-text placeholder:text-roastery-muted/50 transition-colors focus:border-roastery-accent focus:outline-none";

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = "Required";

  const digits = values.phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Required";
  else if (digits.length < 10) errors.phone = "Doesn't look like a full number";

  if (values.orderType === "delivery" && !values.address.trim()) {
    errors.address = "Required for delivery";
  }

  return errors;
}

export default function CheckoutForm() {
  const { lines, subtotal, hydrated, clearCart } = useCart();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [placedOrder, setPlacedOrder] = useState(null);

  const deliveryFee = deliveryFeeFor(subtotal, values.orderType);
  const total = subtotal + deliveryFee;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit() {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({
            menuItemId: line.menuItemId,
            qty: line.quantity,
            customizations: line.customizations,
          })),
          customer_name: values.name.trim(),
          phone: values.phone.trim(),
          order_type: values.orderType,
          delivery_address:
            values.orderType === "delivery" ? values.address.trim() : null,
          notes: values.notes.trim() || null,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrors({ form: payload.error ?? "Something went wrong" });
        setStatus("idle");
        return;
      }

      setPlacedOrder(payload.order);
      clearCart();
      setStatus("success");
    } catch {
      setErrors({ form: "Couldn't reach the server. Try again." });
      setStatus("idle");
    }
  }

  if (!hydrated) {
    return <div className="mt-16 h-64" />;
  }

  if (status === "success") {
    return (
      <div className="mt-16 rounded-2xl border border-white/5 bg-roastery-panel p-12 text-center">
        <h2 className="font-heading text-3xl text-roastery-text">
          Order received
        </h2>
        <p className="mt-4 text-sm text-roastery-muted">Your order number</p>
        <p className="mt-1 font-heading text-2xl text-roastery-accent-text">
          {placedOrder?.reference}
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-roastery-muted">
          The bar has it. You&apos;ll see it move from confirmed to ready on the
          tracking page as we work through it.
        </p>

        {placedOrder?.reference ? (
          <Link
            href={`/order/${placedOrder.reference}`}
            className="mt-9 inline-block rounded-full bg-roastery-accent px-7 py-3 text-sm font-medium text-roastery-bg transition-colors hover:bg-roastery-accent-text"
          >
            Track this order
          </Link>
        ) : null}

        <div className="mt-5">
          <Link
            href="/menu"
            className="text-sm text-roastery-muted transition-colors hover:text-roastery-text"
          >
            Back to the menu
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-16 rounded-2xl border border-white/5 bg-roastery-panel p-12 text-center">
        <h2 className="font-heading text-2xl text-roastery-text">
          Your order is empty
        </h2>
        <Link
          href="/menu"
          className="mt-7 inline-block rounded-full bg-roastery-accent px-7 py-3 text-sm font-medium text-roastery-bg transition-colors hover:bg-roastery-accent-text"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-2 ${inputClasses}`}
          />
          {errors.name && (
            <p className="mt-2 text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0300 1234567"
            value={values.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-2 ${inputClasses}`}
          />
          {errors.phone && (
            <p className="mt-2 text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-roastery-muted">
            Collection
          </p>
          <div className="mt-3 flex gap-3">
            {["pickup", "delivery"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setValues((prev) => ({ ...prev, orderType: type }))
                }
                aria-pressed={values.orderType === type}
                className={`flex-1 rounded-lg px-5 py-3 text-sm capitalize transition-colors duration-200 ${
                  values.orderType === type
                    ? "bg-roastery-accent font-medium text-roastery-bg"
                    : "border border-roastery-muted/25 text-roastery-muted hover:border-roastery-accent/40 hover:text-roastery-text"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {values.orderType === "delivery" && (
          <div>
            <label
              htmlFor="address"
              className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
            >
              Delivery address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={values.address}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`mt-2 resize-none ${inputClasses}`}
            />
            {errors.address && (
              <p className="mt-2 text-xs text-red-400">{errors.address}</p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="notes"
            className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
          >
            Notes{" "}
            <span className="normal-case tracking-normal text-roastery-muted/60">
              (optional)
            </span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Extra hot, no sugar in the second one, and so on"
            value={values.notes}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-2 resize-none ${inputClasses}`}
          />
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-white/5 bg-roastery-panel p-7 lg:sticky lg:top-24">
        <h2 className="font-heading text-xl text-roastery-text">Summary</h2>

        <ul className="mt-6 space-y-4 border-b border-white/5 pb-6">
          {lines.map((line) => {
            const detail = describeCustomizations(line.customizations);

            return (
              <li key={line.lineId} className="flex justify-between gap-4">
                <div>
                  <p className="text-sm text-roastery-text">
                    {line.quantity} × {line.name}
                  </p>
                  {detail && (
                    <p className="mt-1 text-xs text-roastery-muted">{detail}</p>
                  )}
                </div>
                <p className="shrink-0 text-sm text-roastery-muted">
                  {formatPrice(line.unitPrice * line.quantity)}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-roastery-muted">Subtotal</span>
            <span className="text-roastery-text">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-roastery-muted">Delivery</span>
            <span className="text-roastery-text">
              {values.orderType === "pickup"
                ? "—"
                : deliveryFee === 0
                  ? "Free"
                  : formatPrice(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-4">
            <span className="text-roastery-text">Total</span>
            <span className="font-heading text-lg text-roastery-accent-text">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {errors.form && (
          <p className="mt-5 text-sm text-red-400">{errors.form}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-7 w-full rounded-full bg-roastery-accent px-6 py-3 text-sm font-medium text-roastery-bg transition-colors duration-200 hover:bg-roastery-accent-text disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </div>
  );
}