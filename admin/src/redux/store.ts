import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import { generalApiSlice } from "./apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
// import headerReducer from "./slices/headerSlice"; 
// Assume this exists; type it similarly if needed

// Define the store
export const store = configureStore({
  reducer: {
    // header: headerReducer,
    app: appReducer,
    [generalApiSlice.reducerPath]: generalApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(generalApiSlice.middleware),
});

// Setup listeners for refetch behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;