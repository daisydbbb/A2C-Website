// use createSlice to manage synchronous state updates
import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "PayPal",
      billingAddress: {},
    }; // { cartItems: [{_id: "1", price: 10, qty: 1 ...}] }

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
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    saveBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  saveBillingAddress,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
