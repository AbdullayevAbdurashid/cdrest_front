import { createSlice } from "@reduxjs/toolkit";
import { CartProduct } from "interfaces";
import { RootState } from "redux/store";

type CartType = {
  cartItems: CartProduct[];
};

const initialState: CartType = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { payload } = action;
      const existingIndex = state.cartItems.findIndex(
        (item) => item.id === payload.id
      );
      if (existingIndex >= 0) {
        state.cartItems[existingIndex].quantity += payload.quantity;
      } else {
        state.cartItems.push(payload);
      }
    },
    setToCart(state, action) {
      const { payload } = action;
      const existingIndex = state.cartItems.findIndex(
        (item) => item.id === payload.id
      );
      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = payload;
      } else {
        state.cartItems.push(payload);
      }
    },
    reduceCartItem(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      }
    },
    removeFromCart(state, action) {
      state.cartItems.map((cartItem) => {
        if (cartItem.id === action.payload.id) {
          const nextCartItems = state.cartItems.filter(
            (item) => item.id !== cartItem.id
          );
          state.cartItems = nextCartItems;
        }
        return state;
      });
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  reduceCartItem,
  setToCart,
} = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cartItems;
export const selectTotalPrice = (state: RootState) =>
  state.cart.cartItems.reduce(
    (total, item) => (total += item.quantity * item.stock.price),
    0
  );

export default cartSlice.reducer;
