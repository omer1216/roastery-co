"use client";

import { useState } from "react";
import Image from "next/image";

export default function MenuImage({ src, alt, sizes, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-roastery-bg">
        <span className="font-heading text-2xl text-roastery-muted/25">
          {alt?.charAt(0) ?? "R"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}