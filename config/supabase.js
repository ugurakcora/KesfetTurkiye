import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yclxtaayljqogolfaywe.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbHh0YWF5bGpxb2dvbGZheXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NDE5MTgsImV4cCI6MjA1MTAxNzkxOH0.vE_wQRsLeUOWx1-okK0CTWVZt081uPtSAIa8UNuFH24";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Favori işlemleri için yardımcı fonksiyonlar
export const favoriteHelpers = {
  // Favori ekle
  addFavorite: async (userId, placeId, placeData) => {
    const { data, error } = await supabase.from("favorites").insert([
      {
        user_id: userId,
        place_id: placeId,
        place_data: placeData,
      },
    ]);

    if (error) throw error;
    return data;
  },

  // Favori sil
  removeFavorite: async (userId, placeId) => {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .match({ user_id: userId, place_id: placeId });

    if (error) throw error;
    return data;
  },

  // Kullanıcının favorilerini getir
  getFavorites: async (userId) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir yerin favori olup olmadığını kontrol et
  isFavorite: async (userId, placeId) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .match({ user_id: userId, place_id: placeId })
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  },
};
