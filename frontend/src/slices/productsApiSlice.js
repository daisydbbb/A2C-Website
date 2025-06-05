import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL, UPLOAD_URL } from "../constants";

// injectEndpoints is a function that allows us to inject the endpoints into the apiSlice
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // query hook, returns an object with the data, isLoading, error, and refetch etc
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5, // save data for 5 seconds,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    // mutation hook, returns an array with 2 elements [triggerfunction, {isLoading, error etc.}]
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: (product) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} = //useXXXQuery is the hook that allows us to use the query
  productsApiSlice;
