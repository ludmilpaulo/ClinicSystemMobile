// src/redux/slices/basketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Drug } from '../../utils/types';

type CartItem = Drug & { quantity: number };

interface BasketState {
  items: CartItem[];
}

const initialState: BasketState = {
  items: [],
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    updateBasket: (state, action: PayloadAction<Drug>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    decreaseBasket: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },
  },
});

export const { updateBasket, decreaseBasket } = basketSlice.actions;
export const selectCartItems = (state: { basket: BasketState }) => state.basket.items;
export default basketSlice.reducer;
