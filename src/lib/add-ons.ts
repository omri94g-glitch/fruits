// Small fixed catalog (not a DB table) - example items/prices until the client
// supplies a real add-on menu. The checkout API re-validates selected add-ons
// against this list, so prices here are always the source of truth.
export type AddOn = {
  id: string;
  label: string;
  price: number;
};

export const ADD_ONS: AddOn[] = [
  { id: "greeting-card", label: "כרטיס ברכה מודפס", price: 15 },
  { id: "balloons", label: "זר בלונים קטן", price: 25 },
  { id: "chocolate-dip", label: "טבילת שוקולד לפירות נבחרים", price: 20 },
];

export function getAddOn(id: string): AddOn | undefined {
  return ADD_ONS.find((a) => a.id === id);
}
