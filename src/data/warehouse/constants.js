export const PRIMARY_BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "New Balance",
  "Under Armour",
];

/** Apparel-only brands — warehouse stocks clothing, not equipment or accessories */
export const EXTRA_BRANDS = [
  "ASICS", "Brooks", "Saucony", "Hoka", "Salomon", "Columbia", "The North Face",
  "Patagonia", "Lululemon", "Fila", "Champion", "Skechers", "Vans", "Converse",
  "Jordan", "Timberland", "Arc'teryx", "Mammut", "Castelli", "Rapha", "Assos",
  "Pearl Izumi", "Sugoi", "Santini", "Sportful", "Endura", "Gore Wear", "Craft",
  "Icebreaker", "Smartwool", "Darn Tough", "Feetures", "Balega", "Stance",
  "Bombas", "Dickies", "Carhartt", "Wrangler", "Levi's", "Lee", "Diesel",
  "Guess", "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren", "Lacoste", "Hugo Boss",
  "Zara", "H&M", "Uniqlo", "Gap", "Old Navy", "Banana Republic", "Superdry",
  "North Sails", "G-Star RAW", "Scotch & Soda", "Ted Baker", "AllSaints",
  "River Island", "Next", "Marks & Spencer", "Primark", "Boohoo", "ASOS",
  "PrettyLittleThing", "Missguided", "New Look", "Topshop", "Monsoon",
  "French Connection", "Reiss", "Whistles", "Hobbs", "Phase Eight",
  "Joules", "Barbour", "Belstaff", "Burberry", "Paul Smith", "Fred Perry",
  "Ben Sherman", "Lacoste Live", "Ellesse", "Kappa", "Umbro", "Lotto",
  "Diadora", "K-Swiss", "Saucony Originals", "On Running", "Altra",
];

export const ALL_BRANDS = [...PRIMARY_BRANDS, ...EXTRA_BRANDS];

export const ORDER_STATUSES = [
  { key: "unshipped", label: "Unshipped", color: "red" },
  { key: "ready", label: "Ready To Process", color: "orange" },
  { key: "packed", label: "Packed", color: "yellow" },
  { key: "dispatched", label: "Dispatched", color: "green" },
];

export const SHIP_STATUSES = [
  { key: "in_transit", label: "In Transit", color: "blue" },
  { key: "delivered", label: "Delivered", color: "green" },
  { key: "exception", label: "Exception", color: "red" },
];

export const INVENTORY_STATUSES = [
  { key: "healthy", label: "Healthy", color: "green" },
  { key: "low", label: "Low Stock", color: "yellow" },
  { key: "critical", label: "Critical", color: "red" },
  { key: "out", label: "Out Of Stock", color: "gray" },
];

export const STAFF = [
  "Sarah Chen", "Marcus Johnson", "Elena Rodriguez", "James Wilson",
  "Priya Patel", "David Kim", "Anna Mueller", "Chris Taylor",
  "Lisa Anderson", "Michael Brown", "Sophie Martin", "Ryan O'Brien",
];

export const WAREHOUSES = [
  { id: "wh-uk-01", name: "London Fulfillment Center", zone: "UK-EU" },
  { id: "wh-de-01", name: "Frankfurt Distribution Hub", zone: "EU-Central" },
  { id: "wh-us-01", name: "New Jersey Warehouse", zone: "US-East" },
];

export const WAREHOUSE_ZONES = ["A", "B", "C", "D", "E", "F"];

export const COUNTRIES = [
  "United Kingdom", "Germany", "France", "Netherlands", "Spain", "Italy",
  "United States", "Canada", "Australia", "Belgium", "Austria", "Poland",
];

export const REVIEW_REASONS = [
  { key: "invalid_address", label: "Invalid Address", severity: "high" },
  { key: "missing_sku", label: "Missing SKU Mapping", severity: "high" },
  { key: "label_failed", label: "Label Generation Failed", severity: "critical" },
  { key: "amazon_failed", label: "Amazon Upload Failed", severity: "critical" },
  { key: "inventory_mismatch", label: "Inventory Mismatch", severity: "medium" },
  { key: "duplicate", label: "Duplicate Orders", severity: "medium" },
  { key: "manual", label: "Manual Review Required", severity: "low" },
];

export const TIMELINE_EVENTS = [
  "Order received",
  "Order packed",
  "Label generated",
  "Dispatched",
  "Delivered",
];

/** Clothing & wearable apparel only — no shoes, bags, or sports equipment */
export const PRODUCT_TYPES = [
  "T-Shirt", "Polo Shirt", "Long Sleeve Tee", "Tank Top", "Crop Top",
  "Hoodie", "Zip Hoodie", "Sweatshirt", "Crewneck Jumper", "Cardigan",
  "Track Jacket", "Windbreaker", "Puffer Jacket", "Fleece Jacket", "Rain Jacket",
  "Jeans", "Chinos", "Joggers", "Cargo Trousers", "Leggings", "Yoga Pants",
  "Athletic Shorts", "Denim Shorts", "Swim Trunks", "Board Shorts",
  "Sports Bra", "Vest", "Dress", "Skirt", "Tennis Skirt", "Golf Polo",
  "Cycling Jersey", "Compression Top", "Compression Leggings", "Base Layer Top",
  "Thermal Top", "Thermal Leggings", "Pyjama Set", "Robe",
  "Socks", "Ankle Socks", "Crew Socks", "Cap", "Beanie", "Scarf", "Gloves",
];

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const CLOTHING_COLORS = [
  "Black", "White", "Navy", "Grey", "Red", "Blue", "Green", "Khaki", "Beige", "Burgundy",
];

/** Group clothing types for warehouse pick-path filtering */
export const CLOTHING_CATEGORIES = [
  { key: "tops", label: "Tops", types: ["T-Shirt", "Polo Shirt", "Long Sleeve Tee", "Tank Top", "Crop Top", "Golf Polo", "Cycling Jersey", "Compression Top", "Base Layer Top", "Thermal Top", "Vest", "Sports Bra"] },
  { key: "outerwear", label: "Outerwear", types: ["Hoodie", "Zip Hoodie", "Sweatshirt", "Crewneck Jumper", "Cardigan", "Track Jacket", "Windbreaker", "Puffer Jacket", "Fleece Jacket", "Rain Jacket"] },
  { key: "bottoms", label: "Bottoms", types: ["Jeans", "Chinos", "Joggers", "Cargo Trousers", "Leggings", "Yoga Pants", "Athletic Shorts", "Denim Shorts", "Swim Trunks", "Board Shorts", "Compression Leggings", "Thermal Leggings"] },
  { key: "dresses", label: "Dresses & Skirts", types: ["Dress", "Skirt", "Tennis Skirt"] },
  { key: "nightwear", label: "Nightwear", types: ["Pyjama Set", "Robe"] },
  { key: "accessories", label: "Accessories", types: ["Socks", "Ankle Socks", "Crew Socks", "Cap", "Beanie", "Scarf", "Gloves"] },
];

export const PICK_QUEUE_PRESETS = [
  { key: "single-qty1", label: "Single · Qty 1", description: "Fastest picks — one item per order", filters: { orderType: "single", qtyGroup: "1", statuses: ["unshipped", "ready"] } },
  { key: "single-qty2", label: "Single · Qty 2", description: "Same SKU, two units", filters: { orderType: "single", qtyGroup: "2", statuses: ["unshipped", "ready"] } },
  { key: "single-qty3", label: "Single · Qty 3+", description: "Bulk single-SKU orders", filters: { orderType: "single", qtyGroup: "3+", statuses: ["unshipped", "ready"] } },
  { key: "multi-line", label: "Multiline Orders", description: "Multiple line items per order", filters: { orderType: "multi", statuses: ["unshipped", "ready"] } },
  { key: "ready-to-pack", label: "Ready to Pack", description: "Picked items awaiting pack station", filters: { statuses: ["packed"] } },
  { key: "needs-label", label: "Needs Label", description: "Packed, label not uploaded", filters: { statuses: ["packed"], hasTracking: false } },
];
