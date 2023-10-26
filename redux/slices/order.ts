import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { OrderFormValues } from "interfaces";

type OrderType = {
  order: OrderFormValues;
};

const initialState: OrderType = {
  order: {} as OrderFormValues,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setDeliveryDate(state, action) {
      const { payload } = action;
      state.order.delivery_date = payload.delivery_date;
      state.order.delivery_time = payload.delivery_time;
      state.order.shop_id = payload.shop_id;
    },
    clearOrder(state) {
      state.order = {} as OrderFormValues;
    },
  },
});

export const { setDeliveryDate, clearOrder } = orderSlice.actions;

export const selectOrder = (state: RootState) => state.order;

export default orderSlice.reducer;
