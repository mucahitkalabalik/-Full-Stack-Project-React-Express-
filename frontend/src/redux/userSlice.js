import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/axios"; // Axios instance'ını içe aktar

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const userRegister = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/register", data);
      console.log(response.data, "register response");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Network error");
    }
  }
);
export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", { email, password });
      console.log(response.data, "login response");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Network error");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || "An error occurred";
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", 'admin');
        localStorage.setItem("id", action.payload.user._id);
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || "An error occurred";
      });
  },
});

export default userSlice.reducer;
