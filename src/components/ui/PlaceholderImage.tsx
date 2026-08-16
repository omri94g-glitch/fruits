import { ImageOff } from "lucide-react";

export function PlaceholderImage({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-cream-alt border border-line text-ink/30 ${className}`}
    >
      <ImageOff size={28} strokeWidth={1.5} />
      {label && <span className="text-xs text-ink/40">{label}</span>}
    </div>
  );
}
