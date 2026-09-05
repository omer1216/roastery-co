export const SIZE_MODIFIERS = { S: -100, M: 0, L: 150 };
export const MILK_MODIFIERS = { whole: 0, none: 0, oat: 150, almond: 200 };

export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_THRESHOLD = 2500;

export function lineUnitPrice(item, customizations = {}) {
  let price = item.price;

  if (customizations.size && SIZE_MODIFIERS[customizations.size] != null) {
    price += SIZE_MODIFIERS[customizations.size];
  }

  if (customizations.milk && MILK_MODIFIERS[customizations.milk] != null) {
    price += MILK_MODIFIERS[customizations.milk];
  }

  return price;
}

export function buildLineId(menuItemId, customizations = {}) {
  const parts = Object.keys(customizations)
    .sort()
    .filter((key) => customizations[key] != null)
    .map((key) => `${key}:${customizations[key]}`);

  return [menuItemId, ...parts].join("|");
}

export function describeCustomizations(customizations = {}) {
  const order = ["size", "temperature", "milk", "sweetness"];
  const labels = {
    S: "Small",
    M: "Medium",
    L: "Large",
    hot: "Hot",
    iced: "Iced",
    whole: "Whole milk",
    oat: "Oat milk",
    almond: "Almond milk",
    none: "No milk",
  };

  return order
    .map((key) => customizations[key])
    .filter(Boolean)
    .map((value) => labels[value] ?? value)
    .join(" · ");
}

export function cartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function deliveryFeeFor(subtotal, orderType) {
  if (orderType !== "delivery") return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
}