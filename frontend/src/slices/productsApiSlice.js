import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL } from "../constants";

// injectEndpoints is a function that allows us to inject the endpoints into the apiSlice
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({ url: PRODUCTS_URL, method: "GET" }),
      keepUnusedDataFor: 5, // save data for 5 seconds,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice;
