import React, { useEffect, useState } from "react";
import { Product, ProductExtra, Stock } from "interfaces";
import { getExtras, sortExtras } from "utils/getExtras";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { clearCart, selectCart, setToCart } from "redux/slices/cart";
import useModal from "hooks/useModal";
import CartReplaceModal from "components/clearCartModal/cartReplacePrompt";
import { useQuery } from "react-query";
import productService from "services/product";
import ProductUI from "./productUI";
import AddonsForm from "components/extrasForm/addonsForm";
import { info } from "components/alert/toast";
import { useTranslation } from "react-i18next";
import { useShop } from "contexts/shop/shop.context";
import { selectCurrency } from "redux/slices/currency";

type Props = {
  handleClose: () => void;
  uuid: string;
};
type ShowExtrasType = {
  extras: Array<ProductExtra[]>;
  stock: Stock;
};
type SelectedAddon = {
  id: string;
  quantity: number;
};

export default function ProductSingle({ handleClose, uuid }: Props) {
  const { t } = useTranslation();
  const [counter, setCounter] = useState<number>(1);
  const [extras, setExtras] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [showExtras, setShowExtras] = useState<ShowExtrasType>({
    extras: [],
    stock: {
      id: 0,
      quantity: 1,
      price: 0,
    },
  });
  const [extrasIds, setExtrasIds] = useState<any[]>([]);
  const [addons, setAddons] = useState<Product[]>([]);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const currency = useAppSelector(selectCurrency);
  const [openPrompt, handleOpenPrompt, handleClosePrompt] = useModal();
  const { isOpen, isShopClosed } = useShop();
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  const { data } = useQuery(
    ["product", uuid, currency],
    () => productService.getById(uuid, { currency_id: currency?.id }),
    {
      enabled: Boolean(uuid),
      select: (data) => data.data,
    }
  );

  useEffect(() => {
    if (data) {
      setCounter(data.min_qty || 1);
      const myData = sortExtras(data);
      setExtras(myData.extras);
      setStock(myData.stock);
      setShowExtras(getExtras("", myData.extras, myData.stock));
      getExtras("", myData.extras, myData.stock).extras?.forEach((element) => {
        setExtrasIds((prev) => [...prev, element[0]]);
      });
    }
  }, [data]);

  const handleExtrasClick = (e: any) => {
    setSelectedAddons([]);
    const index = extrasIds.findIndex(
      (item) => item.extra_group_id === e.extra_group_id
    );
    let array = extrasIds;
    if (index > -1) array = array.slice(0, index);
    array.push(e);
    const nextIds = array.map((item) => item.id).join(",");
    var extrasData = getExtras(nextIds, extras, stock);
    setShowExtras(extrasData);
    extrasData.extras?.forEach((element) => {
      const index = extrasIds.findIndex((item) =>
        element[0].extra_group_id != e.extra_group_id
          ? item.extra_group_id === element[0].extra_group_id
          : item.extra_group_id === e.extra_group_id
      );
      if (element[0].level >= e.level) {
        var itemData =
          element[0].extra_group_id != e.extra_group_id ? element[0] : e;
        if (index == -1) array.push(itemData);
        else {
          array[index] = itemData;
        }
      }
    });
    setExtrasIds(array);
  };

  function addCounter() {
    setCounter((prev) => prev + 1);
  }

  function reduceCounter() {
    setCounter((prev) => prev - 1);
  }

  function handleAddToCart() {
    if (!isOpen || isShopClosed) {
      info(t("shop.closed"));
      return;
    }
    if (!checkIsAbleToAddProduct()) {
      handleOpenPrompt();
      return;
    }
    storeCart();
  }

  function storeCart() {
    const products = addons.map((item) => ({
      id: item.id,
      img: item.img,
      translation: item.translation,
      quantity: item.stock?.quantity,
      stock: item.stock,
      shop_id: item.shop_id,
      extras: [],
    }));
    const product = {
      id: data?.id,
      img: data?.img,
      translation: data?.translation,
      quantity: counter,
      stock: showExtras.stock,
      shop_id: data?.shop_id,
      extras: extrasIds.map((item) => item.value),
      addons: products,
      interval: data?.interval,
      unit: data?.unit,
    };
    dispatch(setToCart(product));
    handleClose();
  }

  function checkIsAbleToAddProduct() {
    let isActiveCart: boolean;
    if (!!cart.length) {
      isActiveCart = cart.some((item) => item.shop_id === data?.shop_id);
    } else {
      isActiveCart = true;
    }
    return isActiveCart;
  }

  function handleClearCart() {
    dispatch(clearCart());
    storeCart();
  }

  function handleAddonClick(list: Product[]) {
    setAddons(list);
  }

  function calculateTotalPrice() {
    const addonPrice = addons.reduce(
      (total, item) =>
        (total +=
          Number(item.stock?.total_price) * Number(item.stock?.quantity)),
      0
    );
    return addonPrice + Number(showExtras.stock?.total_price) * counter;
  }

  return (
    <div>
      <ProductUI
        data={data || {}}
        loading={!!data}
        stock={showExtras.stock}
        extras={showExtras.extras}
        counter={counter}
        addCounter={addCounter}
        reduceCounter={reduceCounter}
        handleExtrasClick={handleExtrasClick}
        handleAddToCart={handleAddToCart}
        totalPrice={calculateTotalPrice()}
        extrasIds={extrasIds}
      >
        <AddonsForm
          data={showExtras.stock.addons || []}
          handleAddonClick={handleAddonClick}
          quantity={counter}
          selectedAddons={selectedAddons}
          onSelectAddon={setSelectedAddons}
        />
      </ProductUI>
      <CartReplaceModal
        open={openPrompt}
        handleClose={handleClosePrompt}
        onSubmit={handleClearCart}
      />
    </div>
  );
}
