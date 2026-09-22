export type Piece = {
  id: string;
  name: string;
  category: string;
  price: number;
  art: string;
  description: string;
};
export const pieces: Piece[] = [
  {
    id: "01",
    name: "The Fold Wrap",
    category: "Wearables",
    price: 85000,
    art: "fold",
    description:
      "A study in movement. An enveloping silhouette imagined in a softly structured textile, made for the everyday ritual of getting dressed.",
  },
  {
    id: "02",
    name: "Contour Vessel",
    category: "Objects",
    price: 62000,
    art: "vessel",
    description:
      "An exploration of volume and quiet presence. A sculptural object imagined for the spaces we make our own.",
  },
  {
    id: "03",
    name: "Memory Cloth",
    category: "Textiles",
    price: 48000,
    art: "cloth",
    description:
      "Texture, rhythm and a sense of belonging. A textile concept that brings a considered layer to contemporary living.",
  },
];
export const categories = [
  "Wearables",
  "Objects",
  "Textiles",
  "Limited editions",
];
export const stories = [
  {
    title: "The things we choose to keep.",
    category: "Culture & objects",
    art: "vessel",
    body: "Some objects become part of our daily language. We return to them for their weight, their texture, or the memories they hold. This is a reflection on living with fewer, more meaningful things—and leaving room for their stories to grow.",
  },
  {
    title: "A conversation with material.",
    category: "Inside the studio",
    art: "cloth",
    body: "Every design begins with a question: what does the material want to become? These early studies explore the relationship between softness and structure, light and surface. They are an invitation to look more closely at the ordinary.",
  },
];
export const formatPrice = (price: number) =>
  `₦${price.toLocaleString("en-NG")}`;
