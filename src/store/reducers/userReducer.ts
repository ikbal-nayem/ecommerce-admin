import { IUserInfo } from "@interfaces/user.interface";
import { createSlice } from "@reduxjs/toolkit";
import { LocalStorageService } from "services/utils/local-storage.service";

const userData: any = LocalStorageService.get("user_data");

const initialState: IUserInfo = {
  user_data: userData || null,
  accessToken: LocalStorageService.get("accessToken") || null,
  activePlan: LocalStorageService.get("activePlan") || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return action.payload;
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
