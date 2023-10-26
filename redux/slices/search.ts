import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";

type SearchType = {
  searchHistory: string[];
};

const initialState: SearchType = {
  searchHistory: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addToSearch(state, action) {
      const { payload } = action;
      const existingIndex = state.searchHistory.findIndex(
        (item) => item === payload
      );
      if (existingIndex < 0) {
        state.searchHistory.unshift(payload);
      }
      if (state.searchHistory.length > 5) {
        state.searchHistory.pop();
      }
    },
    removeFromSearch(state, action) {
      const { payload } = action;
      state.searchHistory.map((item) => {
        if (item === payload) {
          const nextCartItems = state.searchHistory.filter(
            (item) => item !== payload
          );
          state.searchHistory = nextCartItems;
        }
        return state;
      });
    },
    clearSearch(state) {
      state.searchHistory = [];
    },
  },
});

export const { addToSearch, removeFromSearch, clearSearch } =
  searchSlice.actions;

export const selectSearchHistory = (state: RootState) =>
  state.search.searchHistory;

export default searchSlice.reducer;
