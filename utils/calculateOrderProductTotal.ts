import { OrderDetailsType } from "interfaces";

type ReturnType = {
  addonsTotal: number;
  productTotal: number;
  totalPrice: number;
  oldPrice: number;
};

export default function calculateOrderProductTotal(
  data: OrderDetailsType
): ReturnType {
  if (!data) {
    return {
      addonsTotal: 0,
      productTotal: 0,
      totalPrice: 0,
      oldPrice: 0,
    };
  }
  const addonsTotal = data.addons.reduce(
    (total, item) => (total += item.total_price),
    0
  );
  const productTotal = data.total_price;
  const totalPrice = productTotal + addonsTotal;
  const oldPrice = totalPrice + data.discount;

  return {
    addonsTotal,
    productTotal,
    totalPrice,
    oldPrice,
  };
}
