import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import  userSlice  from "./userSlice";
export const store = configureStore({
  reducer: {
    products: productSlice,
    user: userSlice,
  },
});
