import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");
const key = env.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();

if (!key) {
  console.error("No GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const MODEL = "gemini-3.5-flash-lite";

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/interactions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      store: false,
      system_instruction: "You are a barista. Always reply in exactly three words.",
      input: [
        {
          type: "user_input",
          content: "what is your name?",
        },
      ],
      tools: [
        {
          type: "function",
          name: "add_to_cart",
          description: "Adds a drink from the menu to the customer's cart.",
          parameters: {
            type: "object",
            properties: {
              item_name: { type: "string", description: "Menu item name" },
              quantity: { type: "integer", description: "How many" },
            },
            required: ["item_name", "quantity"],
          },
        },
      ],
    }),
  }
);

const data = await response.json();
console.log("Status:", response.status);
console.log(JSON.stringify(data, null, 2));