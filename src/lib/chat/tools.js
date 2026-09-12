export const CHAT_TOOLS = [
  {
    type: "function",
    name: "add_to_cart",
    description:
      "Add a drink or food item from the menu to the customer's cart. Only use this when the customer has clearly decided they want something.",
    parameters: {
      type: "object",
      properties: {
        item_name: {
          type: "string",
          description: "The exact menu item name, e.g. 'Flat white'",
        },
        quantity: {
          type: "integer",
          description: "How many of this item. Default to 1 if unspecified.",
        },
        size: { type: "string", description: "Size code, e.g. 'S', 'M', 'L'" },
        milk: { type: "string", description: "Milk choice, e.g. 'whole', 'oat'" },
        sweetness: { type: "string", description: "Sweetness level" },
        temperature: {
          type: "string",
          enum: ["hot", "iced"],
          description: "Hot or iced. Not all items support both.",
        },
      },
      required: ["item_name", "quantity"],
    },
  },
  {
    type: "function",
    name: "update_cart",
    description:
      "Change the quantity of an item already in the customer's cart.",
    parameters: {
      type: "object",
      properties: {
        item_name: {
          type: "string",
          description: "Name of the item already in the cart",
        },
        quantity: {
          type: "integer",
          description: "The new total quantity. Must be at least 1.",
        },
      },
      required: ["item_name", "quantity"],
    },
  },
  {
    type: "function",
    name: "remove_from_cart",
    description: "Remove an item from the customer's cart entirely.",
    parameters: {
      type: "object",
      properties: {
        item_name: {
          type: "string",
          description: "Name of the item to remove",
        },
      },
      required: ["item_name"],
    },
  },
];