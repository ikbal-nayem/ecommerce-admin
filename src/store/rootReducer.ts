import { combineReducers } from "@reduxjs/toolkit";
import ordersReducer from "./reducers/ordersReducer";
import userReducer from "./reducers/userReducer";

export interface SessionState {
  user: any;
  orders: any;
  // utile: any;
}

const rootReducer = combineReducers<SessionState>({
  user: userReducer,
  orders: ordersReducer,
  // utile: utileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
