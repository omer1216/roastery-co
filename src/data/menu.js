export const PLACEHOLDER_IMAGE = "/images/menu/placeholder.jpg";
export const MENU_ITEMS = [
  // Coffee
  { id: "espresso", name: "Espresso", description: "Double shot, house blend", category: "coffee", price: 450, temperature: "both", popular: false, image_url: "/images/menu/espresso.jpg", available: true, customizations: { sizes: ["M"] } },
  { id: "americano", name: "Americano", description: "Espresso over water", category: "coffee", price: 550, temperature: "both", popular: false, image_url: "/images/menu/americano.jpg", available: true, customizations: { sizes: ["S", "M", "L"] } },
  { id: "flat-white", name: "Flat white", description: "Espresso, steamed milk, thin microfoam", category: "coffee", price: 750, temperature: "both", popular: true, image_url: "/images/menu/flat-white.jpg", available: true, customizations: { sizes: ["S", "M", "L"], milk: ["whole", "oat", "almond"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "cappuccino", name: "Cappuccino", description: "Espresso, steamed milk, thick foam", category: "coffee", price: 700, temperature: "both", popular: false, image_url: "/images/menu/cappuccino.jpg", available: true, customizations: { sizes: ["S", "M", "L"], milk: ["whole", "oat", "almond"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "latte", name: "Latte", description: "Espresso, steamed milk, light foam", category: "coffee", price: 750, temperature: "both", popular: false, image_url: "/images/menu/latte.jpg", available: true, customizations: { sizes: ["S", "M", "L"], milk: ["whole", "oat", "almond"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "cold-brew", name: "Cold brew", description: "Steeped 18 hours, served over ice", category: "coffee", price: 800, temperature: "iced", popular: false, image_url: "/images/menu/cold-brew.jpg", available: true, customizations: { sizes: ["S", "M", "L"], milk: ["whole", "oat", "almond", "none"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "pour-over", name: "Pour-over (single origin)", description: "Rotating origin", category: "coffee", price: 950, temperature: "hot", popular: false, image_url: "/images/menu/pour-over.jpg", available: true, customizations: { sizes: ["S", "M"] } },

  // Tea
  { id: "doodh-patti", name: "Doodh Patti", description: "Strong black tea slow-simmered with full-cream milk, classic desi-style", category: "tea", price: 450, temperature: "hot", popular: false, image_url: "/images/menu/doodh-patti.jpg", available: true, customizations: { sizes: ["S", "M", "L"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "karak-chai", name: "Karak Chai", description: "Densely spiced, extra-strong milk tea, boiled down for a bold cup", category: "tea", price: 500, temperature: "hot", popular: true, image_url: "/images/menu/karak-chai-u.jpg", available: true, customizations: { sizes: ["S", "M", "L"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "elaichi-chai", name: "Elaichi Chai", description: "Black tea lightly spiced with whole green cardamom", category: "tea", price: 480, temperature: "hot", popular: false, image_url: "/images/menu/elaichi-chai.jpg", available: true, customizations: { sizes: ["S", "M", "L"], sweetness: ["none", "light", "regular", "extra"] } },
  { id: "kashmiri-chai", name: "Kashmiri Chai", description: "Pink salted tea, pistachio and almond garnish", category: "tea", price: 650, temperature: "hot", popular: false, image_url: "/images/menu/kashmiri-chai.jpg", available: true, customizations: { sizes: ["S", "M", "L"] } },
  { id: "qehwa", name: "Qehwa", description: "Saffron and cardamom-infused green tea, no milk", category: "tea", price: 600, temperature: "hot", popular: false, image_url: "/images/menu/qehwa.jpg", available: true, customizations: { sizes: ["S", "M"], sweetness: ["none", "light", "regular"] } },
  { id: "brown-sugar-boba", name: "Brown Sugar Boba Milk Tea", description: "Black tea, brown sugar tapioca pearls, choice of milk", category: "tea", price: 850, temperature: "iced", popular: false, image_url: "/images/menu/brown-sugar-boba.jpg", available: true, customizations: { sizes: ["M", "L"], milk: ["whole", "oat", "almond"], sweetness: ["light", "regular", "extra"] } },
  { id: "taro-boba", name: "Taro Boba", description: "Creamy taro-flavored milk tea with tapioca pearls", category: "tea", price: 850, temperature: "iced", popular: false, image_url: "/images/menu/taro-boba.jpg", available: true, customizations: { sizes: ["M", "L"], milk: ["whole", "oat", "almond"], sweetness: ["light", "regular", "extra"] } },

  // Specialty
  { id: "honey-oat-latte", name: "Honey oat latte", description: "Espresso, oat milk, raw honey", category: "specialty", price: 800, temperature: "both", popular: true, image_url: "/images/menu/honey-oat-latte.jpg", available: true, customizations: { sizes: ["S", "M", "L"], milk: ["oat", "almond", "whole"], sweetness: ["light", "regular", "extra"] } },
  { id: "maple-cortado", name: "Maple cortado", description: "Equal parts espresso and steamed milk, maple syrup", category: "specialty", price: 750, temperature: "hot", popular: false, image_url: "/images/menu/maple-cortado.jpg", available: true, customizations: { sizes: ["S"], milk: ["whole", "oat", "almond"] } },
  { id: "cardamom-cold-brew", name: "Cardamom cold brew", description: "Cold brew infused with whole cardamom pods", category: "specialty", price: 800, temperature: "iced", popular: false, image_url: "/images/menu/cardamom-cold-brew.jpg", available: true, customizations: { sizes: ["M", "L"], milk: ["none", "whole", "oat", "almond"], sweetness: ["none", "light", "regular"] } },
  { id: "lavender-matcha", name: "Lavender matcha", description: "Ceremonial matcha, culinary lavender, oat milk", category: "specialty", price: 850, temperature: "both", popular: false, image_url: "/images/menu/lavender-matcha.jpg", available: true, customizations: { sizes: ["M", "L"], milk: ["oat", "almond", "whole"], sweetness: ["none", "light", "regular"] } },

  // Bakery
  { id: "butter-croissant", name: "Butter croissant", description: "Laminated daily, baked in-house", category: "bakery", price: 450, temperature: null, popular: false, image_url: "/images/menu/butter-croissant.jpg", available: true, customizations: {} },
  { id: "pistachio-cookie", name: "Pistachio cookie", description: "Brown butter, whole pistachios", category: "bakery", price: 500, temperature: null, popular: false, image_url: "/images/menu/pistachio-cookie.jpg", available: true, customizations: {} },
  { id: "banana-bread", name: "Banana bread", description: "Walnut, dark chocolate chunks", category: "bakery", price: 500, temperature: null, popular: true, image_url: "/images/menu/banana-bread.jpg", available: true, customizations: {} },
  { id: "cinnamon-roll", name: "Cinnamon roll", description: "Cream cheese glaze", category: "bakery", price: 550, temperature: null, popular: false, image_url: "/images/menu/cinnamon-roll.jpg", available: true, customizations: {} },
  { id: "almond-biscotti", name: "Almond biscotti", description: "Twice-baked, espresso-friendly", category: "bakery", price: 400, temperature: null, popular: false, image_url: "/images/menu/almond-biscotti.jpg", available: true, customizations: {} },
];

export const POPULAR_ITEMS = MENU_ITEMS.filter((item) => item.popular);

export function formatPrice(price) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}