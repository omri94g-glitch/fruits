"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Accessibility, X } from "lucide-react";

type Settings = {
  fontLevel: number;
  contrast: boolean;
  grayscale: boolean;
  links: boolean;
  readable: boolean;
  noMotion: boolean;
};

const DEFAULTS: Settings = {
  fontLevel: 0,
  contrast: false,
  grayscale: false,
  links: false,
  readable: false,
  noMotion: false,
};

const FONT_STEPS = [100, 115, 130, 150];
const STORAGE_KEY = "rfruits-a11y";

const TOGGLES: { key: Exclude<keyof Settings, "fontLevel">; label: string }[] = [
  { key: "contrast", label: "ניגודיות גבוהה" },
  { key: "grayscale", label: "גווני אפור" },
  { key: "links", label: "הדגשת קישורים" },
  { key: "readable", label: "גופן קריא" },
  { key: "noMotion", label: "עצירת אנימציות" },
];

function applyToDocument(s: Settings) {
  const root = document.documentElement;
  root.style.fontSize = s.fontLevel > 0 ? `${FONT_STEPS[s.fontLevel]}%` : "";
  root.classList.toggle("a11y-contrast", s.contrast);
  root.classList.toggle("a11y-grayscale", s.grayscale);
  root.classList.toggle("a11y-links", s.links);
  root.classList.toggle("a11y-readable", s.readable);
  root.classList.toggle("a11y-no-motion", s.noMotion);
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULTS,
      ...parsed,
      fontLevel: Math.min(Math.max(Number(parsed.fontLevel) || 0, 0), FONT_STEPS.length - 1),
    };
  } catch {
    return DEFAULTS;
  }
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  // Only the (settings-independent) trigger button renders on first paint, so
  // reading localStorage during the client's initial render can't mismatch.
  const [settings, setSettings] = useState<Settings>(() =>
    typeof window === "undefined" ? DEFAULTS : loadSettings()
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    applyToDocument(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable (private mode) - settings still apply for this visit
    }
  }, [settings]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggle = (key: (typeof TOGGLES)[number]["key"]) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  const stepFont = (delta: number) =>
    setSettings((s) => ({
      ...s,
      fontLevel: Math.min(Math.max(s.fontLevel + delta, 0), FONT_STEPS.length - 1),
    }));

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-green-700 text-cream shadow-lg hover:bg-green-600 transition-colors"
      >
        <Accessibility size={26} />
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="תפריט נגישות"
          className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-xs rounded-2xl bg-cream border border-line shadow-xl p-5 flex flex-col gap-4 text-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-ink">נגישות</h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="סגירת תפריט נגישות"
              className="text-ink hover:text-green-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-ink">גודל טקסט: {FONT_STEPS[settings.fontLevel]}%</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => stepFont(-1)}
                disabled={settings.fontLevel === 0}
                aria-label="הקטנת טקסט"
                className="w-10 h-10 rounded-full border border-line text-ink hover:border-green-700 disabled:opacity-40"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => stepFont(1)}
                disabled={settings.fontLevel === FONT_STEPS.length - 1}
                aria-label="הגדלת טקסט"
                className="w-10 h-10 rounded-full border border-line text-ink hover:border-green-700 disabled:opacity-40"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                aria-pressed={settings[key]}
                className={`rounded-full px-4 py-2.5 text-right border transition-colors ${
                  settings[key]
                    ? "bg-green-700 text-cream border-green-700"
                    : "border-line text-ink hover:border-green-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSettings(DEFAULTS)}
              className="text-ink underline underline-offset-2 hover:text-green-700"
            >
              איפוס הגדרות
            </button>
            <Link
              href="/accessibility"
              onClick={() => setOpen(false)}
              className="text-ink underline underline-offset-2 hover:text-green-700"
            >
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
