import Link from "next/link";
import { SiteNavigation, CartContents } from "@/components/interactive";
export default function CartPage() { return <><SiteNavigation/><main className="cart-page"><p className="eyebrow">Sésé / Your selection</p><h1>Cart</h1><CartContents/><Link className="text-link" href="/store/retail">Continue shopping</Link></main></>; }
