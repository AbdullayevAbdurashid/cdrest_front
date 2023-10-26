import { useReducer } from "react";
import { RestaurantContext } from "./restaurant.context";
import { removeCookie, setCookie } from "utils/session";
import { IShop } from "interfaces";
import useShopWorkingSchedule from "hooks/useShopWorkingSchedule";

enum RestaurantActionKind {
  UPDATE = "UPDATE_RESTAURANT",
  RESET = "RESET_RESTAURANT",
}

interface RestaurantAction {
  type: RestaurantActionKind;
  payload?: any;
}

interface RestaurantState {
  restaurant?: IShop;
}

function reducer(state: RestaurantState, action: RestaurantAction) {
  const { type, payload } = action;
  switch (type) {
    case RestaurantActionKind.UPDATE:
      setCookie("restaurant", JSON.stringify(payload));
      return {
        ...state,
        restaurant: payload,
      };
    case RestaurantActionKind.RESET:
      removeCookie("restaurant");
      return {};
    default:
      return state;
  }
}

type Props = {
  children: any;
  restaurantState?: IShop;
};

export function RestaurantProvider({ children, restaurantState }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    restaurant: restaurantState,
  });

  const { workingSchedule, isShopClosed, isOpen } = useShopWorkingSchedule(
    state.restaurant
  );

  function updateRestaurant(data?: IShop) {
    dispatch({ type: RestaurantActionKind.UPDATE, payload: data });
  }

  function resetRestaurant() {
    dispatch({ type: RestaurantActionKind.RESET, payload: null });
  }

  return (
    <RestaurantContext.Provider
      value={{
        restaurant: state?.restaurant,
        updateRestaurant,
        resetRestaurant,
        workingSchedule,
        isShopClosed,
        isOpen,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}
