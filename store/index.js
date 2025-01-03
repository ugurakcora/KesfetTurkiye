import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import favoritesReducer from "./favoritesSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    user: userReducer,
  },
});
