"use client";

import { useState } from "react";

const SUBJECTS = [
  { value: "general", label: "General enquiry" },
  { value: "catering", label: "Catering" },
  { value: "wholesale", label: "Wholesale beans" },
  { value: "private-hire", label: "Private hire" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "general",
  message: "",
};

const inputClasses =
  "w-full rounded-lg border border-roastery-muted/20 bg-roastery-bg px-4 py-3 text-sm text-roastery-text placeholder:text-roastery-muted/50 transition-colors focus:border-roastery-accent focus:outline-none";

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Required";
  }

  if (!values.email.trim()) {
    errors.email = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Doesn't look like an email address";
  }

  if (values.phone.trim() && values.phone.trim().length < 7) {
    errors.phone = "Too short to be a phone number";
  }

  if (!values.message.trim()) {
    errors.message = "Required";
  } else if (values.message.trim().length < 10) {
    errors.message = "Tell us a bit more";
  }

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Request failed");

      setValues(EMPTY_FORM);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-roastery-panel p-10 text-center">
        <h2 className="font-heading text-2xl text-roastery-text">
          Message received
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-roastery-muted">
          Someone will get back to you within a working day. If it's urgent,
          the phone is answered during opening hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm text-roastery-accent-text transition-colors hover:text-roastery-text"
        >
          Send another
        </button>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="rounded-2xl border border-white/5 bg-roastery-panel p-8 sm:p-10">
      <h2 className="font-heading text-2xl text-roastery-text">Send a message</h2>

      <div className="mt-8 space-y-5">
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
            type="text"
            value={values.name}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            className={`mt-2 ${inputClasses}`}
          />
          {errors.name && (
            <p className="mt-2 text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              className={`mt-2 ${inputClasses}`}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
            >
              Phone{" "}
              <span className="normal-case tracking-normal text-roastery-muted/60">
                (optional)
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.phone)}
              className={`mt-2 ${inputClasses}`}
            />
            {errors.phone && (
              <p className="mt-2 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-2 ${inputClasses}`}
          >
            {SUBJECTS.map((subject) => (
              <option
                key={subject.value}
                value={subject.value}
                className="bg-roastery-bg"
              >
                {subject.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs uppercase tracking-[0.15em] text-roastery-muted"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.message)}
            className={`mt-2 resize-none ${inputClasses}`}
          />
          {errors.message && (
            <p className="mt-2 text-xs text-red-400">{errors.message}</p>
          )}
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400">
            That didn't go through. Try again, or call us instead.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-full bg-roastery-accent px-7 py-3 text-sm font-medium text-roastery-bg transition-colors duration-200 hover:bg-roastery-accent-text disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </div>
  );
}