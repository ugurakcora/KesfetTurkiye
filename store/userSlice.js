import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../config/supabase";

// Async thunks
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (metadata, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error("Update profile error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Fetch profile error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
