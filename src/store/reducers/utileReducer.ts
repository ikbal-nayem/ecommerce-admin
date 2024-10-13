import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  globCategoriesList: any[] | [];
  globProductsList: [];
  globCustomerList: [];
  globCustomerGroupList: [];
}

const initialState: IInitialState = {
  globProductsList: [],
  globCategoriesList: [],
  globCustomerList: [],
  globCustomerGroupList: [],
};

export const utileSlice = createSlice({
  name: "utile",
  initialState: initialState,
  reducers: {
    setGlobProductList: (state, { type, payload }) => {
      state.globProductsList = payload;
    },
    setGlobCategoryList: (state, { type, payload }) => {
      state.globCategoriesList = payload;
    },
    setGlobCustomerList: (state, { type, payload }) => {
      state.globCustomerList = payload;
    },
    setGlobCustomerGroupList: (state, { type, payload }) => {
      state.globCustomerGroupList = payload;
    },
  },
});

export const {
  setGlobProductList,
  setGlobCategoryList,
  setGlobCustomerList,
  setGlobCustomerGroupList,
} = utileSlice.actions;

export default utileSlice.reducer;
