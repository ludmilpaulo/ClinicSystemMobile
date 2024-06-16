import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";

interface StoreProviderProps {
  children: ReactNode;
}

const store = configureStore({
  reducer: {
    basket: basketReducer,
  },
});

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default StoreProvider;
