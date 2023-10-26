import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IShop } from "interfaces";
import { RootState } from "redux/store";

export type FavoriteRestaurantsType = {
  favoriteRestaurants: IShop[];
};

const initialState: FavoriteRestaurantsType = {
  favoriteRestaurants: [],
};

const favoriteRestaurantSlice = createSlice({
  name: "favoriteRestaurants",
  initialState,
  reducers: {
    addToLiked(store, action: PayloadAction<IShop>) {
      store.favoriteRestaurants.push({ ...action.payload });
    },
    removeFromLiked(state, action: PayloadAction<IShop>) {
      const { payload } = action;
      const filtered = state.favoriteRestaurants.filter(
        (item) => item.uuid !== payload.uuid
      );
      state.favoriteRestaurants = filtered;
    },
    clearLikedRestaurants(state) {
      state.favoriteRestaurants = [];
    },
  },
});

export const { addToLiked, removeFromLiked, clearLikedRestaurants } =
  favoriteRestaurantSlice.actions;

export const selectLikedRestaurants = (state: RootState) =>
  state.liked.favoriteRestaurants;

export default favoriteRestaurantSlice.reducer;
