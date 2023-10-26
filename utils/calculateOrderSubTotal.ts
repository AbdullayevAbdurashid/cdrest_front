import { Order } from "interfaces";

export default function calculateOrderSubTotal(data?: Order) {
  if (!data) {
    return 0;
  }
  const productsTotal = data.details.reduce(
    (total, item) => (total += item.total_price || 0),
    0
  );
  const addonsTotal = data.details
    .flatMap((item) => item.addons)
    .reduce((total, item) => (total += item.total_price), 0);

  const totalDiscount = data.total_discount || 0;
  const subTotal = productsTotal + addonsTotal + totalDiscount;

  return data?.origin_price || 0;
}
