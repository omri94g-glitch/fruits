// One stored format (Israeli local, digits only) so "050-123-4567" and
// "+972501234567" count as the same customer instead of two.
export function normalizePhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00972")) digits = digits.slice(5);
  else if (digits.startsWith("972")) digits = digits.slice(3);
  if (digits && !digits.startsWith("0")) digits = `0${digits}`;
  return digits;
}
