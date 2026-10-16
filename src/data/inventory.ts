export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number; // in NGN
  description: string;
  image: string;
  slideImage?: string;
  stock: number;
  sizes?: string[];
  details?: string[];
  art?: string;
  store?: "retail" | "bespoke";
  availability?: "ready-to-buy" | "made-to-order";
  featured?: boolean;
}

export interface CartItemInput {
  id: string;
  qty: number;
  selectedSize?: string;
}

export interface ValidatedCartItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  image: string;
  selectedSize?: string;
  subtotal: number;
}

export interface Order {
  orderId: string;
  reference: string;
  accessCode?: string;
  items: ValidatedCartItem[];
  officialTotal: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  gateway: 'paystack' | 'stripe';
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
  testMode?: boolean;
  paymentMetadata?: Record<string, unknown>;
}

// Initial product catalog
export const initialProducts: Product[] = [
  {
    id: "retail-kaftan-01",
    slug: "structured-monochrome-kaftan",
    name: "Structured Monochrome Kaftan",
    category: "Kaftans",
    price: 145000,
    description: "Architectural kaftan silhouette cut from breathable raw cotton and fine wool blend. Featuring structured raglan shoulders and tonal placket stitching.",
    image: "/images/sese_kaftan.jpg",
    slideImage: "/images/sese_kaftan.jpg",
    stock: 8,
    sizes: ["S", "M", "L", "XL"],
    details: [
      "100% Hand-loomed raw structured cotton",
      "Concealed front mother-of-pearl fastenings",
      "Split hem with artisanal seam binding",
      "Crafted in Lagos, Nigeria",
    ],
  },
  {
    id: "retail-suit-01",
    slug: "heritage-tailored-suit",
    name: "Heritage Tailored Two-Piece Suit",
    category: "Suits",
    price: 285000,
    description: "Bespoke-informed tailored two-piece suit with high-armhole structured chest construction and tapered relaxed trousers.",
    image: "/images/SUITS/sese_suit1.jpg",
    slideImage: "/images/sese_slide3.jpg",
    stock: 5,
    sizes: ["38R", "40R", "42R", "44R"],
    details: [
      "Heavyweight wool-silk blend (380gsm)",
      "Full canvas floating interlining",
      "Double back vent & hand-stitched pick lapels",
      "Matching adjustable side-tab trousers",
    ],
  },
  {
    id: "retail-suit-02",
    slug: "ceremonial-double-breasted-suit",
    name: "Ceremonial Double-Breasted Suit",
    category: "Suits",
    price: 320000,
    description: "Architectural double-breasted suit tailored with sculpted peak lapels, genuine horn buttons, and fluid double-pleat trousers.",
    image: "/images/SUITS/sese_suit2.jpg",
    stock: 10,
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    details: [
      "Super 130s lightweight Italian wool-cashmere",
      "6x2 double-breasted peak lapel silhouette",
      "Hand-stitched milanese buttonholes",
      "High-rise trousers with double reverse pleats",
    ],
  },
  {
    id: "retail-jacket-01",
    slug: "sculpted-evening-jacket",
    name: "Sculpted Drape Evening Jacket",
    category: "Jackets",
    price: 195000,
    description: "Cut from heavy textured crepe with subtle asymmetric drape and concealed placket, balancing architectural rigor and fluidity.",
    image: "/images/sese_retail_jacket.png",
    slideImage: "/images/sese_slide4.jpg",
    stock: 6,
    sizes: ["38", "40", "42", "44"],
    details: [
      "Structured Japanese crepe with matte finish",
      "Internal silk organza pocket welts",
      "Single button closure with hidden magnet catch",
      "Dry clean only",
    ],
  },
  {
    id: "retail-jacket-02",
    slug: "architectural-crepe-jacket",
    name: "Architectural Crepe Drape Jacket",
    category: "Jackets",
    price: 185000,
    description: "Structured drape tailoring with tonal lapels and fluid silhouette.",
    image: "/images/sese_slide4.jpg",
    slideImage: "/images/sese_slide4.jpg",
    stock: 5,
    sizes: ["38", "40", "42", "44"],
    details: [
      "Mid-weight tactile crepe construction",
      "Soft unlined interior with bound seams",
      "Crafted in Lagos, Nigeria",
    ],
  },
  {
    id: "retail-shirt-01",
    slug: "mandarin-collar-raw-shirt",
    name: "Mandarin Collar Raw Silk Shirt",
    category: "Shirts",
    price: 95000,
    description: "Minimalist mandarin collar tunic woven with contrasting tactile twill weave and elongated barrel cuffs.",
    image: "/images/sese_slide5.jpg",
    slideImage: "/images/sese_slide5.jpg",
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Handspun raw silk and Egyptian cotton",
      "Natural shell button down front",
      "Reinforced gusset stitching at side seams",
      "Soft pre-washed finish",
    ],
  },
  {
    id: "retail-shirt-02",
    slug: "tailored-relaxed-silk-shirt",
    name: "Tailored Relaxed Silk Shirt",
    category: "Shirts",
    price: 105000,
    description: "Fluid silhouette raw silk shirt with structured cuffs and hand-finished placket.",
    image: "/images/sese_slide6.jpg",
    slideImage: "/images/sese_slide6.jpg",
    stock: 8,
    sizes: ["S", "M", "L", "XL"],
    details: [
      "100% Hand-loomed raw silk",
      "Mother-of-pearl fastenings",
      "Relaxed tailored silhouette",
    ],
  },
  {
    id: "retail-slippers-01",
    slug: "contour-leather-slippers",
    name: "Contour Burnished Leather Slippers",
    category: "Slippers",
    price: 65000,
    description: "Hand-burnished calfskin leather slip-on with memory cushioned footbed and sculpted stacked leather sole.",
    image: "/images/sese_slippers.jpg",
    slideImage: "/images/sese_slippers.jpg",
    stock: 10,
    sizes: ["41", "42", "43", "44", "45"],
    details: [
      "Full-grain Nigerian calfskin leather",
      "Hand-rubbed vegetable dye patina",
      "Cushioned memory foam insole",
      "Protective rubber heel insert",
    ],
  },
  {
    id: "retail-shoes-01",
    slug: "architectural-derby-shoes",
    name: "Architectural Derby Dress Shoes",
    category: "Shoes",
    price: 160000,
    description: "Grounded Goodyear-welted leather formal footwear with sculpted heel, chiseled round toe and waxed cotton laces.",
    image: "/images/sese_shoes.jpg",
    slideImage: "/images/sese_shoes.jpg",
    stock: 7,
    sizes: ["41", "42", "43", "44", "45"],
    details: [
      "Hand-selected box calf leather upper",
      "Goodyear-welted double leather sole",
      "Hand-painted beveled waist",
      "Includes cedar shoe bags",
    ],
  },
  // Existing collection pieces
  {
    id: "01",
    slug: "fold-wrap",
    name: "The Fold Wrap",
    category: "Wearables",
    price: 85000,
    description: "A softly structured textile wrap, shaped for movement and everyday wear.",
    image: "/images/sese_slide2.jpg",
    stock: 10,
    sizes: ["One Size"],
  },
  {
    id: "02",
    slug: "contour-vessel",
    name: "Contour Vessel",
    category: "Objects",
    price: 62000,
    description: "A sculptural vessel with a quiet, grounded presence.",
    image: "/images/man-bag.png",
    stock: 4,
    sizes: ["One Size"],
  },
  {
    id: "03",
    slug: "memory-cloth",
    name: "Memory Cloth",
    category: "Textiles",
    price: 48000,
    description: "A considered textile study in texture, rhythm and belonging.",
    image: "/images/sese_slide7.jpg",
    stock: 9,
    sizes: ["One Size"],
  },
];

// Persistent runtime store for inventory and orders
// Use globalThis to maintain state across Next.js API reloads in development
declare global {
  var __seseInventory: Map<string, Product> | undefined;
  var __seseOrders: Map<string, Order> | undefined;
}

if (!globalThis.__seseInventory) {
  globalThis.__seseInventory = new Map();
}

initialProducts.forEach((p) => {
  const merged = { ...p };
  globalThis.__seseInventory!.set(p.id, merged);
  globalThis.__seseInventory!.set(p.slug, merged);
});

if (!globalThis.__seseOrders) {
  globalThis.__seseOrders = new Map();
}

const inventoryStore = globalThis.__seseInventory;
const ordersStore = globalThis.__seseOrders;

export function getAllProducts(): Product[] {
  // Return unique products by ID
  const unique = new Map<string, Product>();
  inventoryStore.forEach((p) => unique.set(p.id, p));
  return Array.from(unique.values());
}

export function getProductById(idOrSlug: string): Product | undefined {
  return inventoryStore.get(idOrSlug);
}

export function getProductByImage(imageSrc: string, categoryName?: string): Product | undefined {
  if (!imageSrc) return undefined;
  const normalized = imageSrc.replace(/^[./]+/, "/").split("?")[0].toLowerCase();
  const all = getAllProducts();

  // If categoryName is provided, strictly search within matching category first
  if (categoryName) {
    const catFiltered = all.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase());

    const matchCatImage = catFiltered.find((p) => {
      const pImg = p.image.toLowerCase();
      return pImg === normalized || normalized.endsWith(pImg) || pImg.endsWith(normalized);
    });
    if (matchCatImage) return matchCatImage;

    const matchCatSlide = catFiltered.find((p) => {
      if (!p.slideImage) return false;
      const pSlide = p.slideImage.toLowerCase();
      return pSlide === normalized || normalized.endsWith(pSlide) || pSlide.endsWith(normalized);
    });
    if (matchCatSlide) return matchCatSlide;

    const filename = normalized.split("/").pop();
    if (filename) {
      const matchCatFilename = catFiltered.find(
        (p) => p.image.toLowerCase().includes(filename) || (p.slideImage && p.slideImage.toLowerCase().includes(filename))
      );
      if (matchCatFilename) return matchCatFilename;
    }

    if (catFiltered.length > 0) {
      return catFiltered[0];
    }
  }

  // General fallback when categoryName is not provided
  const matchImage = all.find((p) => {
    const pImg = p.image.toLowerCase();
    return pImg === normalized || normalized.endsWith(pImg) || pImg.endsWith(normalized);
  });
  if (matchImage) return matchImage;

  const matchSlide = all.find((p) => {
    if (!p.slideImage) return false;
    const pSlide = p.slideImage.toLowerCase();
    return pSlide === normalized || normalized.endsWith(pSlide) || pSlide.endsWith(normalized);
  });
  if (matchSlide) return matchSlide;

  const filename = normalized.split("/").pop();
  if (filename) {
    const matchFilename = all.find(
      (p) => p.image.toLowerCase().includes(filename) || (p.slideImage && p.slideImage.toLowerCase().includes(filename))
    );
    if (matchFilename) return matchFilename;
  }

  return all[0];
}

export function getProductBySlideImage(slideImageSrc: string): Product | undefined {
  return getProductByImage(slideImageSrc);
}

export interface CartValidationResult {
  valid: boolean;
  error?: string;
  officialTotal: number;
  items: ValidatedCartItem[];
}

export function validateCartStockAndTotal(cartItems: CartItemInput[]): CartValidationResult {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return {
      valid: false,
      error: "Cart is empty.",
      officialTotal: 0,
      items: [],
    };
  }

  let officialTotal = 0;
  const validatedItems: ValidatedCartItem[] = [];

  for (const item of cartItems) {
    const product = inventoryStore.get(item.id);
    if (!product) {
      return {
        valid: false,
        error: `Product with ID '${item.id}' was not found in our catalog.`,
        officialTotal: 0,
        items: [],
      };
    }

    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty <= 0) {
      return {
        valid: false,
        error: `Invalid quantity for item '${product.name}'.`,
        officialTotal: 0,
        items: [],
      };
    }

    if (product.stock < qty) {
      return {
        valid: false,
        error: `Insufficient stock for '${product.name}'. Only ${product.stock} available (requested ${qty}).`,
        officialTotal: 0,
        items: [],
      };
    }

    const subtotal = product.price * qty;
    officialTotal += subtotal;

    validatedItems.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      qty,
      image: product.image,
      selectedSize: item.selectedSize || (product.sizes ? product.sizes[0] : undefined),
      subtotal,
    });
  }

  return {
    valid: true,
    officialTotal,
    items: validatedItems,
  };
}

export function createOrder(order: Order): Order {
  ordersStore.set(order.orderId, order);
  ordersStore.set(order.reference, order);
  return order;
}

export function getOrder(orderIdOrRef: string): Order | undefined {
  return ordersStore.get(orderIdOrRef);
}

export function markOrderAsPaid(
  reference: string,
  paymentMetadata?: Record<string, unknown>
): { success: boolean; order?: Order; error?: string } {
  const order = ordersStore.get(reference);
  if (!order) {
    return { success: false, error: `Order with reference '${reference}' not found.` };
  }

  if (order.status === "paid") {
    return { success: true, order };
  }

  // Decrement stock in official inventory
  for (const item of order.items) {
    const product = inventoryStore.get(item.id);
    if (product) {
      product.stock = Math.max(0, product.stock - item.qty);
      inventoryStore.set(product.id, { ...product });
      inventoryStore.set(product.slug, { ...product });
    }
  }

  order.status = "paid";
  order.paidAt = new Date().toISOString();
  if (paymentMetadata) {
    order.paymentMetadata = paymentMetadata;
  }

  ordersStore.set(order.orderId, { ...order });
  ordersStore.set(order.reference, { ...order });

  return { success: true, order };
}
