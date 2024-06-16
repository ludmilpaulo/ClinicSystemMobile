import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Drug } from "../../utils/types";

interface BasketState {
  items: (Drug & { quantity: number })[];
}

const initialState: BasketState = {
  items: [],
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    updateBasket: (state, action: PayloadAction<Drug>) => {
      const drug = action.payload;
      const index = state.items.findIndex((item) => item.id === drug.id);

      if (index >= 0) {
        // Update the quantity of the existing drug immutably
        const updatedItems = [...state.items];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity + 1,
        };
        state.items = updatedItems;
      } else {
        // Add the drug to the basket with quantity 1
        state.items.push({ ...drug, quantity: 1 });
      }
    },
    decreaseBasket: (state, action: PayloadAction<number>) => {
      const drugId = action.payload;
      const index = state.items.findIndex((item) => item.id === drugId);

      if (index >= 0 && state.items[index].quantity > 1) {
        // Decrease the quantity of the existing drug immutably
        const updatedItems = [...state.items];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity - 1,
        };
        state.items = updatedItems;
      } else {
        state.items = state.items.filter((item) => item.id !== drugId);
      }
    },
    removeFromBasket: (state, action: PayloadAction<number>) => {
      const drugId = action.payload;
      state.items = state.items.filter((item) => item.id !== drugId);
    },
    removeOrderedItems: (state, action: PayloadAction<number[]>) => {
      // Remove items from cart that were successfully ordered
      const orderedDrugIds = action.payload;
      state.items = state.items.filter(
        (item) => !orderedDrugIds.includes(item.id),
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  updateBasket,
  decreaseBasket,
  removeFromBasket,
  clearCart,
  removeOrderedItems,
} = basketSlice.actions;
export const selectCartItems = (state: RootState) => state.basket.items;

export default basketSlice.reducer;