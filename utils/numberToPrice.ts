export const numberToPrice = (number: number, digits: number = 2) => {
  if (number) {
    return number.toFixed(digits).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
  return "0";
};
