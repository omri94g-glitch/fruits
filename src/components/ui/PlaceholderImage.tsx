import Image from "next/image";
import { ImageOff } from "lucide-react";

export function PlaceholderImage({
  src,
  alt,
  label,
  className = "",
}: {
  src?: string | null;
  alt?: string;
  label?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-cream-alt ${className}`}>
        <Image src={src} alt={alt ?? label ?? ""} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-cream-alt border border-line text-ink/30 ${className}`}
    >
      <ImageOff size={28} strokeWidth={1.5} />
      {label && <span className="text-xs text-ink/40">{label}</span>}
    </div>
  );
}
