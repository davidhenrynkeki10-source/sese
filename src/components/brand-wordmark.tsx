import Image from "next/image";

/** Original supplied logo artwork, isolated in a reusable wordmark viewport. */
export function BrandWordmark() {
  return (
    <Image
      className="brand-wordmark"
      src="/images/sese-navigation-logo.png"
      alt="Sésé"
      width={420}
      height={180}
      unoptimized
      priority
    />
  );
}
