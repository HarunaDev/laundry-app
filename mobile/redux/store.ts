import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import appReducer from "./appSlice";
import { baseApi } from "./baseApiSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),

  devTools: __DEV__,
});

setupListeners(store.dispatch);

// 🔐 Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
