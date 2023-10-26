export default function roundToHundreds(number?: number) {
  const num = Number(number);
  if (!num) {
    return 0;
  }
  return Math.floor(num / 100) * 100;
}
