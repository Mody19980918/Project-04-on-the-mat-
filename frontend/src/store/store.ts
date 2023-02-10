import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export let store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
