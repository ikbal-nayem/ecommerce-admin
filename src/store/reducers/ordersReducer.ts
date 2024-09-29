import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderService } from "services/api/Order.service";

export interface IInitialState {
  orderDetails;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: IInitialState = {
  orderDetails: {},
  loading: "idle",
};

export const orderDetailsByID = createAsyncThunk(
  "orders/getDetails",
  async (orderId: string, thunkAPI) => {
    const response = await OrderService.getDetails({
      body: { id: orderId },
    }).then((res) => res.body);
    return response;
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(orderDetailsByID.fulfilled, (state, { payload }) => {
      state.orderDetails = payload;
    });
  },
});

export const { setOrderDetails } = ordersSlice.actions;

export default ordersSlice.reducer;
