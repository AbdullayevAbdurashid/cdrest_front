export default function getShortTimeType(type?: string) {
  switch (type) {
    case "minute":
      return "min";
    case "hour":
      return "h";
    default:
      return "min";
  }
}
