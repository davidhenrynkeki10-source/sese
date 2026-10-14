import { NextResponse } from "next/server";
import { getAllProducts, getProductById, getProductBySlideImage } from "@/data/inventory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const slide = searchParams.get("slide");

  if (id) {
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  }

  if (slide) {
    const product = getProductBySlideImage(slide);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  }

  const products = getAllProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}
