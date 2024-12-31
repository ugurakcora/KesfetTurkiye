import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../config/supabase";

// Fetch user favorites
export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchUserFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add favorite
export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async ({ userId, placeId, placeData }, { rejectWithValue }) => {
    try {
      console.log("Adding favorite to Supabase:", {
        userId,
        placeId,
        placeData,
      });

      const { data, error } = await supabase
        .from("favorites")
        .insert([
          {
            user_id: userId,
            place_id: placeId,
            place_data: placeData,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return rejectWithValue(error.message);
      }

      console.log("Successfully added favorite:", data[0]);
      return data[0];
    } catch (error) {
      console.error("Error adding favorite:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Remove favorite
export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async ({ userId, placeId }, { rejectWithValue }) => {
    try {
      console.log("Removing favorite from Supabase:", { userId, placeId });

      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: userId, place_id: placeId });

      if (error) {
        console.error("Supabase error:", error);
        return rejectWithValue(error.message);
      }

      console.log("Successfully removed favorite with placeId:", placeId);
      return { placeId };
    } catch (error) {
      console.error("Error removing favorite:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  favorites: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites.push(action.payload);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove favorite
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = state.favorites.filter(
          (fav) => fav.place_id !== action.payload.placeId
        );
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
