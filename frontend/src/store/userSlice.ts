import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { clearLocalStorage, getLocalStorage } from "../hooks/getLocalStorage";

export interface UserState {
  user: {
    id: number;
    admin: boolean;
    super_admin: boolean;
    token: string;
  } | null;
}

export type User = {
  id: number;
  admin: boolean;
  super_admin: boolean;
};

const initialState: UserState = {
  user: getLocalStorage(),
};

const userSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {
    loginAction(state: UserState, action: PayloadAction<{ token: string }>) {
      if (action.payload) {
        let decoded: User = jwtDecode(action.payload.token);
        console.log("action.decoded", decoded.id);
        state.user = {
          id: decoded.id,
          admin: decoded.admin,
          super_admin: decoded.super_admin,
          token: action.payload.token,
        };
      } else {
        console.log("unable to dispatch login action");
      }
    },
    logoutAction(state: UserState) {
      state.user = null;
      clearLocalStorage();
    },
  },
});

export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;
