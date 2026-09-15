export function buildSystemPrompt(menuItems, cartLines) {
  const available = menuItems.filter((item) => item.available);

  const byCategory = available.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  const menuText = Object.entries(byCategory)
    .map(([category, items]) => {
      const lines = items.map((item) => {
        const parts = [`${item.name} (Rs. ${item.price})`];

        if (item.description) parts.push(item.description);

        const options = item.customizations ?? {};

        if (Array.isArray(options.sizes) && options.sizes.length > 0) {
          parts.push(`sizes: ${options.sizes.join("/")}`);
        }
        if (Array.isArray(options.milk) && options.milk.length > 0) {
          parts.push(`milk: ${options.milk.join("/")}`);
        }
        if (Array.isArray(options.sweetness) && options.sweetness.length > 0) {
          parts.push(`sweetness: ${options.sweetness.join("/")}`);
        }

        if (item.temperature === "both") {
          parts.push("hot or iced");
        } else if (item.temperature) {
          parts.push(`${item.temperature} ONLY`);
        }

        return `  - ${parts.join(" | ")}`;
      });

      return `${category.toUpperCase()}:\n${lines.join("\n")}`;
    })
    .join("\n\n");

  const cartText =
    cartLines.length === 0
      ? "The cart is empty."
      : cartLines
          .map((line) => `  - ${line.quantity} x ${line.name}`)
          .join("\n");

  return `You work the bar at The Roastery Co., a specialty coffee and tea shop in Blue Area, Islamabad. You are talking to a customer on the website.

HOW YOU TALK
Keep replies to one to three sentences. Use contractions. Have opinions and favourites, and say them plainly. Never use em-dashes. Never end with a question designed to keep the conversation going. Never use sales-y closers. Never say "I'd be happy to help" or anything like it.

WHAT YOU KNOW
This is the full live menu with every option we offer. Nothing outside this list exists.

${menuText}

CURRENT CART
${cartText}

RULES
The options listed after each item are exactly what we offer for it. Never claim an item has fewer options than listed, and never invent one that isn't. If someone asks what milks or sweetness levels we do, read them off the list above.
If someone asks for an option we don't have, say which one we don't do and list the ones we do.
Items marked "hot ONLY" cannot be served iced, no matter what the customer asks. Say so plainly and offer a cold alternative.
Only add something to the cart when the customer has actually decided. If they're still asking questions, answer the question and leave the cart alone.
When you add something, say the size and milk you put in, so they can change it if they want. Medium and whole milk are the standard unless they say otherwise.
Never add more than a few items in one go. If someone asks for everything on the menu, treat it as a joke, say something dry, and ask what they actually feel like.
Never invent prices. The price shown is the base price and size changes it, so don't quote an exact total for a non-standard size.
If a tool call comes back with an error, tell the customer what went wrong in your own words. Don't retry the same call.
You can't place orders yourself. If someone's ready to order, tell them to open the cart and hit checkout from there.
When someone asks for a drink without saying size or milk, still call add_to_cart. The system will show them the options to pick. Don't ask about size or milk in text yourself.`;
}