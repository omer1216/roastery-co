"use client";

import { useState } from "react";

const REVIEWS = [
  {
    text: "I order the karak twice a week and it's identical every single time. That sounds like a small thing. It isn't, in this city.",
    name: "Hira A.",
    meta: "Regular since 2022",
  },
  {
    text: "Asked what the pour-over was that morning and got a five minute answer about the farm. Slightly more than I needed, but you can tell they care.",
    name: "Daniyal K.",
    meta: "Google review",
  },
  {
    text: "Fourteen drinks for an office meeting, all customised, all labelled correctly. Delivery got there before I did.",
    name: "Samina R.",
    meta: "Office order, F-7",
  },
  {
    text: "The qehwa is the only one in Islamabad that doesn't taste like a teabag apology.",
    name: "Usman T.",
    meta: "Google review",
  },
  {
    text: "Kashmiri chai here is properly pink, not food colouring pink. My mother approved, which genuinely never happens.",
    name: "Fatima S.",
    meta: "Weekend regular",
  },
  {
    text: "Went in for a flat white, left with a bag of beans and a lecture on grind size. No regrets.",
    name: "Ayesha M.",
    meta: "Google review",
  },
  {
    text: "Not cheap. Worth it about four days out of five.",
    name: "Zohaib A.",
    meta: "Google review",
  },
  {
    text: "Cinnamon rolls are gone by noon on weekends. I learned that the hard way, twice.",
    name: "Bilal R.",
    meta: "Blue Area office",
  },
  {
    text: "Wifi actually works and nobody rushes you out. Most of my thesis happened in the corner seat.",
    name: "Hassan I.",
    meta: "Regular since 2023",
  },
  {
    text: "Been coming since they opened. The doodh patti is the one thing I'd argue about if they ever changed it.",
    name: "Nida H.",
    meta: "Regular since 2021",
  },
];

const ROW_ONE = REVIEWS.slice(0, 5);
const ROW_TWO = REVIEWS.slice(5);

function Card({ review }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between rounded-2xl border border-white/5 bg-roastery-panel p-7 sm:w-[22rem]">
      <blockquote className="font-body text-[0.9375rem] leading-relaxed text-roastery-text">
        {review.text}
      </blockquote>

      <figcaption className="mt-6 border-t border-white/5 pt-5">
        <p className="font-body text-sm text-roastery-text">{review.name}</p>
        <p className="mt-0.5 font-body text-xs text-roastery-muted">
          {review.meta}
        </p>
      </figcaption>
    </figure>
  );
}

function Row({ reviews, reverse, paused }) {
  return (
    <div
      className="flex gap-5 py-2.5 w-max"
      style={{ animationPlayState: paused ? "paused" : "running" }}
    >
      <div
        className={`flex gap-5 ${
          reverse ? "marquee-track-reverse" : "marquee-track"
        } ${paused ? "marquee-paused" : ""}`}
      >
        {[...reviews, ...reviews].map((review, index) => (
          <Card key={`${review.name}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-roastery-muted">
          What people say
        </p>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h2 className="font-heading text-3xl text-roastery-text">
            Four hundred regulars, give or take
          </h2>
          <p className="font-body text-sm text-roastery-muted">
            4.8 average across Google and Foodpanda
          </p>
        </div>
      </div>

      <div
        className="relative mt-12 space-y-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <Row reviews={ROW_ONE} paused={paused} />
        <Row reviews={ROW_TWO} paused={paused} reverse />
      </div>
    </section>
  );
}