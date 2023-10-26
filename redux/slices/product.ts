import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "interfaces";
import { RootState } from "redux/store";

type StateType = {
  product?: Product;
  isOpen?: boolean;
  uuid?: string;
};

const initialState: StateType = {
  product: undefined,
  isOpen: false,
  uuid: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<StateType>) {
      const { payload } = action;
      state.product = payload.product;
      state.isOpen = true;
      state.uuid = payload.uuid;
    },
    clearProduct(state) {
      state.product = undefined;
      state.isOpen = false;
      state.uuid = "";
    },
  },
});

export const { setProduct, clearProduct } = productSlice.actions;

export const selectProduct = (state: RootState) => state.product;

export default productSlice.reducer;
