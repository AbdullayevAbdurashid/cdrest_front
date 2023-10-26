import { useRouter } from "next/router";

export default function useShopType() {
  const { pathname } = useRouter();

  return pathname.includes("shop") ? "shop" : "restaurant";
}
