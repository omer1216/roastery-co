import { buildLineId, lineUnitPrice } from "@/lib/cart";

function normalise(text) {
  return String(text ?? "").trim().toLowerCase();
}

export function findMenuItem(items, name) {
  const target = normalise(name);
  if (!target) return null;

  const exact = items.find((item) => normalise(item.name) === target);
  if (exact) return exact;

  const byId = items.find((item) => normalise(item.id) === target);
  if (byId) return byId;

  const partial = items.filter(
    (item) =>
      normalise(item.name).includes(target) ||
      target.includes(normalise(item.name))
  );

  // Ambiguous match is a failure, not a guess.
  return partial.length === 1 ? partial[0] : null;
}

function resolveCustomizations(item, args) {
  const allowed = item.customizations ?? {};
  const result = {};

  if (Array.isArray(allowed.sizes) && allowed.sizes.length > 0) {
    const asked = args.size;
    if (asked && !allowed.sizes.includes(asked)) {
      return { error: `${item.name} doesn't come in size ${asked}.` };
    }
    // Standard pour, not whatever happens to be first in the array.
    result.size = asked ?? (allowed.sizes.includes("M") ? "M" : allowed.sizes[0]);
  }

  if (Array.isArray(allowed.milk) && allowed.milk.length > 0) {
    const asked = args.milk;
    if (asked && !allowed.milk.includes(asked)) {
      return { error: `${item.name} isn't available with ${asked} milk.` };
    }
    result.milk = asked ?? allowed.milk[0];
  }

  if (Array.isArray(allowed.sweetness) && allowed.sweetness.length > 0) {
    const asked = args.sweetness;
    if (asked && !allowed.sweetness.includes(asked)) {
      return { error: `${item.name} doesn't have a ${asked} option.` };
    }
    result.sweetness =
      asked ??
      (allowed.sweetness.includes("regular") ? "regular" : allowed.sweetness[0]);
  }

  // Temperature: the hard one. Five desi teas are hot-only.
  if (item.temperature) {
    const asked = args.temperature;

    if (item.temperature === "both") {
      result.temperature = asked ?? "hot";
    } else {
      if (asked && asked !== item.temperature) {
        return {
          error: `${item.name} is served ${item.temperature} only.`,
        };
      }
      result.temperature = item.temperature;
    }
  }

  return { customizations: result };
}

export function validateToolCall({ name, args, menuItems, cartLines }) {
  if (name === "add_to_cart") {
    const item = findMenuItem(menuItems, args.item_name);

    if (!item) {
      return { ok: false, error: `There's no "${args.item_name}" on the menu.` };
    }

    if (!item.available) {
      return { ok: false, error: `${item.name} is sold out right now.` };
    }

    const quantity = Number(args.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { ok: false, error: "Quantity has to be a whole number from 1 to 20." };
    }

    const resolved = resolveCustomizations(item, args);
    if (resolved.error) return { ok: false, error: resolved.error };

    return {
      ok: true,
      action: {
        type: "add",
        item,
        customizations: resolved.customizations,
        quantity,
      },
      result: {
        added: item.name,
        quantity,
        options: resolved.customizations,
        unit_price: lineUnitPrice(item, resolved.customizations),
      },
    };
  }

  if (name === "update_cart" || name === "remove_from_cart") {
    const target = normalise(args.item_name);
    const matches = cartLines.filter(
      (line) =>
        normalise(line.name) === target || normalise(line.name).includes(target)
    );

    if (matches.length === 0) {
      return { ok: false, error: `There's no ${args.item_name} in the cart.` };
    }

    if (matches.length > 1) {
      return {
        ok: false,
        error: `There's more than one ${args.item_name} variant in the cart. Ask which one.`,
      };
    }

    const line = matches[0];

    if (name === "remove_from_cart") {
      return {
        ok: true,
        action: { type: "remove", lineId: line.lineId },
        result: { removed: line.name },
      };
    }

    const quantity = Number(args.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { ok: false, error: "Quantity has to be a whole number from 1 to 20." };
    }

    return {
      ok: true,
      action: { type: "update", lineId: line.lineId, quantity },
      result: { updated: line.name, quantity },
    };
  }

  return { ok: false, error: `Unknown tool: ${name}` };
}

export { buildLineId };