"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import OptionPicker from "./OptionPicker";

const GREETING =
  "Morning. Ask me anything about the menu, or just tell me what you want.";

export default function ChatWidget() {
  const { lines, addItem, updateQuantity, removeItem, openCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: GREETING },
  ]);
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null);
  const [adding, setAdding] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy, pending]);

  // Focus returns when the panel opens and whenever a reply or an add
  // finishes, so nobody has to click back into the input.
  useEffect(() => {
    if (open && !busy && !adding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, busy, adding]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event) {
      if (panelRef.current?.contains(event.target)) return;
      if (buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function applyActions(actions) {
    let touched = false;

    for (const action of actions) {
      if (action.type === "add") {
        addItem(action.item, action.customizations, action.quantity, {
          silent: true,
        });
        touched = true;
      } else if (action.type === "update") {
        updateQuantity(action.lineId, action.quantity);
        touched = true;
      } else if (action.type === "remove") {
        removeItem(action.lineId);
        touched = true;
      }
    }

    return touched;
  }

  async function handleConfirm(choices) {
    if (!pending) return;

    setAdding(true);

    try {
      const response = await fetch("/api/chat/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuItemId: pending.menuItemId,
          quantity: pending.quantity,
          customizations: choices,
        }),
      });

      const data = await response.json();

      if (response.ok && data.action) {
        applyActions([data.action]);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Added. ${pending.quantity} × ${pending.name}.`,
            showCart: true,
          },
        ]);
        setPending(null);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.error || "Couldn't add that." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Lost connection there. Try again." },
      ]);
    } finally {
      setAdding(false);
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setDraft("");
    setBusy(true);
    setPending(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          cart: lines.map((line) => ({
            lineId: line.lineId,
            name: line.name,
            quantity: line.quantity,
            customizations: line.customizations,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.error || "Something went wrong." },
        ]);
        setHistory(data.history ?? []);
        return;
      }

      const changed = applyActions(data.actions ?? []);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply, showCart: changed },
      ]);
      setHistory(data.history ?? []);
      setPending(data.pending ?? null);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Lost connection there. Try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Chat with the bar"}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-roastery-accent text-roastery-bg shadow-lg transition-transform hover:scale-105"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-[60] flex h-[min(32rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-roastery-panel shadow-2xl"
        >
          <header className="border-b border-white/10 px-5 py-4">
            <p className="font-heading text-sm text-roastery-text">The bar</p>
            <p className="font-body text-xs text-roastery-muted">
              Usually replies instantly
            </p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={
                    message.role === "user"
                      ? "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-roastery-accent px-4 py-2 font-body text-sm text-roastery-bg"
                      : "w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-roastery-bg px-4 py-2 font-body text-sm text-roastery-text"
                  }
                >
                  {message.text}
                </div>

                {message.showCart ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openCart();
                    }}
                    className="mt-2 font-body text-xs text-roastery-accent-text underline underline-offset-4"
                  >
                    View cart
                  </button>
                ) : null}
              </div>
            ))}

            {pending && !busy ? (
              <OptionPicker
                pending={pending}
                onConfirm={handleConfirm}
                busy={adding}
              />
            ) : null}

            {busy ? (
              <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm bg-roastery-bg px-4 py-3">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-roastery-accent-text" />
                <span
                  className="typing-dot h-1.5 w-1.5 rounded-full bg-roastery-accent-text"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="typing-dot h-1.5 w-1.5 rounded-full bg-roastery-accent-text"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !busy) send();
                }}
                maxLength={500}
                placeholder="What can I get you?"
                className="flex-1 rounded-lg border border-white/10 bg-roastery-bg px-3 py-2 font-body text-sm text-roastery-text placeholder:text-roastery-muted/50 outline-none focus:border-roastery-accent"
              />
              <button
                type="button"
                onClick={send}
                disabled={busy || draft.trim().length === 0}
                className="rounded-lg bg-roastery-accent px-4 font-body text-sm font-medium text-roastery-bg transition hover:opacity-90 disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}