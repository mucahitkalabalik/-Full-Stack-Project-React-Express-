import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : { cartItems: [], totalQuantity: 0, totalPrice: 0 };
};

const initialState = {
  products: [],
  product: null,
  ...loadCartFromLocalStorage(), 
  loading: false,
  error: null,
};

export const getProducts = createAsyncThunk("products/getAll", async (keyword) => {
  console.log(keyword,'keyword');
  
  const response = await fetch(`http://localhost:5000/api/products/products${keyword ? `?keyword=${keyword}` : ''}`);
  return await response.json();
});

export const getProduct = createAsyncThunk("product/getOne", async (id) => {
  const response = await fetch(`http://localhost:5000/api/products/products/${id}`);
  return await response.json();
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, name, price, quantity, images } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ _id, name, price, quantity, images });
      }

      state.totalQuantity += quantity;
      state.totalPrice += price * quantity;

      localStorage.setItem(
        "cart",
        JSON.stringify({ cartItems: state.cartItems, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice })
      );
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === itemId);
    
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          state.totalQuantity -= 1;
          state.totalPrice -= existingItem.price;
        } else {
          state.totalQuantity -= 1;
          state.totalPrice -= existingItem.price;
          state.cartItems = state.cartItems.filter((item) => item._id !== itemId);
        }
      }
    
      localStorage.setItem(
        "cart",
        JSON.stringify({ cartItems: state.cartItems, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice })
      );
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);

      if (existingItem) {
        state.totalQuantity += quantity - existingItem.quantity;
        state.totalPrice += existingItem.price * (quantity - existingItem.quantity);
        existingItem.quantity = quantity;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify({ cartItems: state.cartItems, totalQuantity: state.totalQuantity, totalPrice: state.totalPrice })
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;

      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.product = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = productSlice.actions;
export default productSlice.reducer;
