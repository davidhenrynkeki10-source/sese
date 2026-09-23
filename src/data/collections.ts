export type Piece = {
  id: string; slug: string; name: string; category: string; price: number; art: string; description: string;
  store: "retail" | "bespoke"; availability: "ready-to-buy" | "made-to-order"; featured?: boolean;
};
export const pieces: Piece[] = [
  { id: "01", slug: "fold-wrap", name: "The Fold Wrap", category: "Wearables", price: 85000, art: "fold", description: "A softly structured textile wrap, shaped for movement and everyday wear.", store: "retail", availability: "ready-to-buy", featured: true },
  { id: "02", slug: "contour-vessel", name: "Contour Vessel", category: "Objects", price: 62000, art: "vessel", description: "A sculptural vessel with a quiet, grounded presence.", store: "retail", availability: "ready-to-buy", featured: true },
  { id: "03", slug: "memory-cloth", name: "Memory Cloth", category: "Textiles", price: 48000, art: "cloth", description: "A considered textile study in texture, rhythm and belonging.", store: "retail", availability: "ready-to-buy", featured: true },
  { id: "04", slug: "ceremony-wrap", name: "Ceremony Wrap", category: "Wearables", price: 120000, art: "fold", description: "A made-to-order statement wrap, finished to your preferred length and palette.", store: "bespoke", availability: "made-to-order" },
  { id: "05", slug: "heirloom-vessel", name: "Heirloom Vessel", category: "Objects", price: 145000, art: "vessel", description: "A made-to-order sculptural vessel with a custom finish.", store: "bespoke", availability: "made-to-order" },
  { id: "06", slug: "woven-panel", name: "Woven Panel", category: "Textiles", price: 98000, art: "cloth", description: "A made-to-order textile panel, sized for your space.", store: "bespoke", availability: "made-to-order" },
];
export const categories = ["Wearables", "Objects", "Textiles", "Limited editions"];
export const stories: { title: string; category: string; art: string; body: string }[] = [];
export const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;
export const productBySlug = (slug: string) => pieces.find((piece) => piece.slug === slug);
