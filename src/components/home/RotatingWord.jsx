"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["deliberately", "consistently", "masterfully", "thoughtfully"];

const TYPE_MS = 45;
const DELETE_MS = 25;
const HOLD_MS = 1600;

export default function RotatingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(WORDS[0]);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const current = WORDS[wordIndex];

    if (!deleting && text === current) {
      timeoutRef.current = setTimeout(() => setDeleting(true), HOLD_MS);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    } else {
      timeoutRef.current = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? prev.slice(0, -1)
              : current.slice(0, prev.length + 1)
          );
        },
        deleting ? DELETE_MS : TYPE_MS
      );
    }

    return () => clearTimeout(timeoutRef.current);
  }, [text, deleting, wordIndex]);

  return (
    <span className="inline-grid justify-items-start align-bottom">
      {WORDS.map((word) => (
        <span
          key={word}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 italic"
        >
          {word}
        </span>
      ))}

      <span className="col-start-1 row-start-1 italic text-roastery-accent-text">
        {text}
      </span>
    </span>
  );
}