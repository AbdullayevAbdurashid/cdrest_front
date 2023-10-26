import React from "react";
import cls from "./recipeIngredients.module.scss";
import { IRecipe } from "interfaces/recipe.interface";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/button/primaryButton";
import RecipeStockCard from "./recipeStockCard";
import { useMediaQuery } from "@mui/material";
import { useRecipe } from "contexts/recipe/recipe.context";
import Badge from "components/badge/badge";
import Price from "components/price/price";
import { useMutation } from "react-query";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import cartService from "services/cart";
import {
  clearUserCart,
  selectUserCart,
  updateUserCart,
} from "redux/slices/userCart";
import { error, warning } from "components/alert/toast";
import useModal from "hooks/useModal";
import { selectCurrency } from "redux/slices/currency";
import { useAuth } from "contexts/auth/auth.context";
import dynamic from "next/dynamic";
import useRouterStatus from "hooks/useRouterStatus";
import { useRouter } from "next/router";

const CartReplaceModal = dynamic(
  () => import("components/clearCartModal/cartReplacePrompt")
);
const SuccessModal = dynamic(
  () => import("components/successModal/successModal")
);

type Props = { data?: IRecipe };

export default function RecipeIngredients({ data }: Props) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:576px)");
  const { recipeStocks, addableRecipeStocks } = useRecipe();
  const dispatch = useAppDispatch();
  const [openPrompt, handleOpenPrompt, handleClosePrompt] = useModal();
  const [openConfirm, handleOpenConfirm, handleCloseConfirm] = useModal();
  const currency = useAppSelector(selectCurrency);
  const cart = useAppSelector(selectUserCart);
  const { isAuthenticated } = useAuth();
  const { isLoading: isRouterLoading } = useRouterStatus();
  const { push } = useRouter();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => cartService.insert(data),
    onSuccess: (data) => {
      dispatch(updateUserCart(data.data));
      handleOpenConfirm();
    },
    onError: (err) => {
      console.log("err => ", err);
      error(t("try.again"));
    },
  });

  const { isLoading: isLoadingClearCart, mutate: mutateClearCart } =
    useMutation({
      mutationFn: (data: any) => cartService.delete(data),
      onSuccess: () => {
        dispatch(clearUserCart());
        storeCart();
        handleClosePrompt();
      },
    });

  function handleAddToCart() {
    if (!isAuthenticated) {
      warning(t("login.first"));
      return;
    }
    if (!checkIsAbleToAddProduct()) {
      handleOpenPrompt();
      return;
    }
    storeCart();
  }

  function storeCart() {
    const body = {
      shop_id: data?.shop_id,
      currency_id: currency?.id,
      rate: currency?.rate,
      products: addableRecipeStocks.map((item) => ({
        stock_id: item.id,
        quantity: item.qty,
      })),
    };
    mutate(body);
  }

  function checkIsAbleToAddProduct() {
    let isActiveCart: boolean;
    isActiveCart = cart.shop_id === 0 || cart.shop_id === data?.shop_id;
    return isActiveCart;
  }

  function handleClearCart() {
    const ids = [cart.id];
    mutateClearCart({ ids });
  }

  return (
    <div className={cls.wrapper}>
      <header className={cls.header}>
        <h2>{t("ingredients")}</h2>
        {!isMobile && (
          <div className={cls.btnWrapper}>
            <PrimaryButton loading={isLoading} onClick={handleAddToCart}>
              {t("add.items.to.cart", { number: addableRecipeStocks.length })}
            </PrimaryButton>
          </div>
        )}
      </header>
      <div className={cls.block}>
        {recipeStocks?.map((item) => (
          <RecipeStockCard key={item.id} data={item} quantity={item.qty} />
        ))}
        {!!data?.discount_price && (
          <div className={cls.discount}>
            <Badge type="discount" variant="circle" />
            <div className={cls.text}>
              {t("recipe.discount.condition")}{" "}
              <Price number={data?.discount_price} />
            </div>
          </div>
        )}
        {isMobile && (
          <div>
            <PrimaryButton loading={isLoading} onClick={handleAddToCart}>
              {t("add.items.to.cart", { number: addableRecipeStocks.length })}
            </PrimaryButton>
          </div>
        )}
      </div>
      <CartReplaceModal
        open={openPrompt}
        handleClose={handleClosePrompt}
        onSubmit={handleClearCart}
        loading={isLoadingClearCart}
      />
      <SuccessModal
        title={t("go.to.recipe.order")}
        open={openConfirm}
        handleClose={handleCloseConfirm}
        onSubmit={() => push(`/restaurant/${data?.shop_id}/checkout`)}
        loading={isRouterLoading}
        buttonText={t("order")}
      />
    </div>
  );
}
