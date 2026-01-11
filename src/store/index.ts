import { configureStore } from "@reduxjs/toolkit";

const noopReducer = (state = null) => state;

export const store = configureStore({
  reducer: {
    _placeholder: noopReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
