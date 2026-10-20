// Single source of truth for delivery zones and prices. The checkout API
// recomputes the fee from the city here - never trust a fee sent by the client.

export type DeliveryZone = {
  id: "netanya" | "center";
  label: string;
  fee: number;
  cities: string[];
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "netanya",
    label: "נתניה והסביבה",
    fee: 40,
    cities: [
      "נתניה",
      "אבן יהודה",
      "קדימה-צורן",
      "כפר יונה",
      "תל מונד",
      "פרדסיה",
      "בית יצחק-שער חפר",
      "מכמורת",
      "בת חפר",
      "אודים",
      "גאולים",
      "בית יהושע",
    ],
  },
  {
    id: "center",
    label: "אזור המרכז (ממודיעין ועד השרון)",
    fee: 60,
    cities: [
      "הרצליה",
      "רעננה",
      "הוד השרון",
      "כפר סבא",
      "רמת השרון",
      "תל אביב-יפו",
      "רמת גן",
      "גבעתיים",
      "בני ברק",
      "קריית אונו",
      "סביון",
      "אור יהודה",
      "יהוד-מונוסון",
      "פתח תקווה",
      "ראש העין",
      "כוכב יאיר-צור יגאל",
      "גני תקווה",
      "אלעד",
      "שוהם",
      "לוד",
      "רמלה",
      "מודיעין-מכבים-רעות",
    ],
  },
];

// Tolerates spacing/dash variants ("הוד-השרון", "תל אביב יפו") so a value saved
// by an older cart or sent straight to the API still matches its canonical name.
function cityKey(value: string) {
  return value
    .replace(/[֑-ׇ]/g, "")
    .replace(/["'׳״]/g, "")
    .replace(/[-־–—\s]+/g, " ")
    .trim();
}

const CITY_INDEX = new Map<string, { city: string; zone: DeliveryZone }>(
  DELIVERY_ZONES.flatMap((zone) =>
    zone.cities.map((city) => [cityKey(city), { city, zone }] as const)
  )
);

export type DeliveryQuote = { city: string; fee: number; zoneLabel: string };

export function getDeliveryQuote(city: string | null | undefined): DeliveryQuote | null {
  if (!city) return null;
  const match = CITY_INDEX.get(cityKey(city));
  if (!match) return null;
  return { city: match.city, fee: match.zone.fee, zoneLabel: match.zone.label };
}

export const UNSERVED_CITY_MESSAGE =
  "כרגע אנחנו מבצעים משלוחים לנתניה והסביבה ולאזור המרכז. לעיר שלכם צרו קשר בוואטסאפ ונבדוק אם אפשר להגיע.";
