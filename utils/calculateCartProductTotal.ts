import { CartStockWithProducts } from "interfaces";

type Props = {
  addonsTotal: number;
  productTotal: number;
  totalPrice: number;
  oldPrice: number;
};

export default function calculateCartProductTotal(
  data: CartStockWithProducts
): Props {
  if (!data) {
    return {
      addonsTotal: 0,
      productTotal: 0,
      totalPrice: 0,
      oldPrice: 0,
    };
  }
  if (data.bonus) {
    return {
      addonsTotal: 0,
      productTotal: 0,
      totalPrice: 0,
      oldPrice: 0,
    };
  }
  const addonsTotal =
    data?.addons?.reduce(
      (total, item) =>
        (total += Number(item.stock?.total_price) * item.quantity),
      0
    ) || 0;
  const productTotal = Number(data.stock?.total_price) * data.quantity;
  const productDiscount = Number(data.discount) * data.quantity;

  return {
    addonsTotal,
    productTotal,
    totalPrice: addonsTotal + productTotal,
    oldPrice: addonsTotal + productTotal + productDiscount,
  };
}
