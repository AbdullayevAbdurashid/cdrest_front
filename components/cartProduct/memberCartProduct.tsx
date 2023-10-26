import React, { useState } from "react";
import { CartStockWithProducts, MemberInsertProductBody } from "interfaces";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import useDebounce from "hooks/useDebounce";
import useDidUpdate from "hooks/useDidUpdate";
import { useMutation, useQuery } from "react-query";
import cartService from "services/cart";
import { useRouter } from "next/router";
import { updateUserCart } from "redux/slices/userCart";
import CartProductUI from "./cartProductUI";
import { useShop } from "contexts/shop/shop.context";
import { selectCurrency } from "redux/slices/currency";

type Props = {
  data: CartStockWithProducts;
  cartId: number;
  disabled?: boolean;
};

export default function MemberCartProduct({ data, cartId, disabled }: Props) {
  const [quantity, setQuantity] = useState(data.quantity);
  const debouncedQuantity = useDebounce(quantity, 400);
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  const shopId = Number(query.id);
  const { member } = useShop();
  const currency = useAppSelector(selectCurrency);

  const { refetch, isLoading: isCartLoading } = useQuery(
    ["cart", member, currency?.id],
    () =>
      cartService.guestGet(cartId, {
        shop_id: member?.shop_id,
        user_cart_uuid: member?.uuid,
        currency_id: currency?.id,
      }),
    {
      onSuccess: (data) => dispatch(updateUserCart(data.data)),
      enabled: false,
    }
  );

  const { mutate: storeProduct, isLoading } = useMutation({
    mutationFn: (data: any) => cartService.insertGuest(data),
    onSuccess: (data) => {
      dispatch(updateUserCart(data.data));
    },
  });

  const { mutate: deleteProducts, isLoading: isDeleteLoading } = useMutation({
    mutationFn: (data: any) => cartService.deleteGuestProducts(data),
    onSuccess: () => refetch(),
  });

  function addProduct() {
    if (quantity !== data.stock.product.max_qty) {
      setQuantity((count) => count + 1);
    }
  }

  function reduceProduct() {
    if (quantity === data.stock.product.min_qty) {
      setQuantity(0);
    } else {
      setQuantity((count) => count - 1);
    }
  }

  useDidUpdate(() => {
    if (debouncedQuantity) {
      storeProductToCart(data);
    } else {
      deleteFromCart(data);
    }
  }, [debouncedQuantity]);

  function storeProductToCart(product: CartStockWithProducts) {
    const body: MemberInsertProductBody = {
      shop_id: shopId,
      products: [
        {
          stock_id: product.stock.id,
          quantity,
        },
      ],
      cart_id: cartId,
      user_cart_uuid: member?.uuid,
    };
    if (product.addons) {
      product.addons?.forEach((addon) => {
        body.products.push({
          stock_id: addon.stock.id,
          quantity: addon.quantity,
          parent_id: product.stock.id,
        });
      });
    }
    if (!product.bonus) {
      storeProduct(body);
    }
  }

  function deleteFromCart(product: CartStockWithProducts) {
    const addons = product.addons?.map((item) => item.stock.id) || [];
    deleteProducts({ ids: [product.id, ...addons] });
  }

  return (
    <CartProductUI
      data={data}
      loading={isLoading || isCartLoading || isDeleteLoading}
      addProduct={addProduct}
      reduceProduct={reduceProduct}
      quantity={quantity}
      disabled={disabled}
    />
  );
}
