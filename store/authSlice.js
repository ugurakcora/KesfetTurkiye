import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../config/supabase";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for checking user
export const checkUser = createAsyncThunk(
  "auth/checkUser",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session?.user || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check User
      .addCase(checkUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
