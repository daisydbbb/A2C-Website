// use createSlice to manage synchronous state updates
import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] }; // { cartItems: [{_id: "1", price: 10, qty: 1 ...}] }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // payload is item
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map(
          (x) => (x._id === existItem._id ? item : x) // update item if it already exists
        );
      } else {
        state.cartItems = [...state.cartItems, item]; // add item if it doesn't exist
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const item_id = action.payload; // payload is id
      state.cartItems = state.cartItems.filter((x) => x._id !== item_id);
      return updateCart(state);
    },
  },
});
export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
