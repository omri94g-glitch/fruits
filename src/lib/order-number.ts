export function generateOrderNumber() {
  const date = new Date();
  const datePart = `${date.getFullYear() % 100}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RF-${datePart}-${randomPart}`;
}
