import { createSlice } from "@reduxjs/toolkit";
import { CartType } from "interfaces";
import { RootState } from "redux/store";

type UserCartType = {
  userCart: CartType;
};

const initialState: UserCartType = {
  userCart: {
    id: 0,
    shop_id: 0,
    total_price: 0,
    user_carts: [
      {
        id: 0,
        name: "",
        user_id: 1,
        uuid: "",
        cartDetails: [],
      },
    ],
  },
};

const userCartSlice = createSlice({
  name: "userCart",
  initialState,
  reducers: {
    updateUserCart(state, action) {
      const { payload } = action;
      state.userCart = payload;
    },
    updateGroupStatus(state, action) {
      const { payload } = action;
      state.userCart.group = !state.userCart.group;
      state.userCart.id = payload.id;
      state.userCart.owner_id = payload.owner_id;
    },
    clearUserCart(state) {
      state.userCart = initialState.userCart;
    },
  },
});

export const { updateUserCart, updateGroupStatus, clearUserCart } =
  userCartSlice.actions;

export const selectUserCart = (state: RootState) => state.userCart.userCart;

export default userCartSlice.reducer;
