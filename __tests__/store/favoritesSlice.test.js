import favoritesReducer, {
  fetchUserFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "../../store/favoritesSlice";
import { supabase } from "../../config/supabase";

// Supabase metodlarını mock'luyoruz
jest.mock("../../config/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
    })),
  },
}));

describe("Favorites Slice", () => {
  // Her test öncesi mock'ları sıfırlıyoruz
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Initial state testi
  test("should return the initial state", () => {
    expect(favoritesReducer(undefined, { type: undefined })).toEqual({
      favorites: [],
      isLoading: false,
      error: null,
    });
  });

  // Favorileri getirme testleri
  describe("fetchUserFavorites", () => {
    // Başarılı favori getirme testi
    test("handles successful favorites fetch", async () => {
      const mockFavorites = [
        { id: 1, place_id: "place1", user_id: "user1" },
        { id: 2, place_id: "place2", user_id: "user1" },
      ];

      // Supabase yanıtını mock'luyoruz
      supabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockFavorites,
          error: null,
        }),
      }));

      const dispatch = jest.fn();
      const thunk = fetchUserFavorites("user1");
      await thunk(dispatch);

      // Dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("favorites/fetchUserFavorites/pending");
      expect(calls[1][0].type).toBe("favorites/fetchUserFavorites/fulfilled");
      expect(calls[1][0].payload).toEqual(mockFavorites);
    });

    // Başarısız favori getirme testi
    test("handles favorites fetch failure", async () => {
      const errorMessage = "Failed to fetch favorites";

      supabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: new Error(errorMessage),
        }),
      }));

      const dispatch = jest.fn();
      const thunk = fetchUserFavorites("user1");
      await thunk(dispatch);

      // Hata durumunda dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("favorites/fetchUserFavorites/pending");
      expect(calls[1][0].type).toBe("favorites/fetchUserFavorites/rejected");
      expect(calls[1][0].payload).toBe(errorMessage);
    });
  });

  // Favori ekleme testleri
  describe("addFavorite", () => {
    // Başarılı favori ekleme testi
    test("handles successful favorite addition", async () => {
      const mockFavorite = {
        id: 1,
        place_id: "place1",
        user_id: "user1",
        place_data: { name: "Test Place" },
      };

      supabase.from.mockImplementation(() => ({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [mockFavorite],
          error: null,
        }),
      }));

      const dispatch = jest.fn();
      const thunk = addFavorite({
        userId: "user1",
        placeId: "place1",
        placeData: { name: "Test Place" },
      });
      await thunk(dispatch);

      // Dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("favorites/addFavorite/pending");
      expect(calls[1][0].type).toBe("favorites/addFavorite/fulfilled");
      expect(calls[1][0].payload).toEqual(mockFavorite);
    });
  });

  // Favori silme testleri
  describe("removeFavorite", () => {
    // Başarılı favori silme testi
    test("handles successful favorite removal", async () => {
      supabase.from.mockImplementation(() => ({
        delete: jest.fn().mockReturnThis(),
        match: jest.fn().mockResolvedValue({
          error: null,
        }),
      }));

      const dispatch = jest.fn();
      const thunk = removeFavorite({ userId: "user1", placeId: "place1" });
      await thunk(dispatch);

      // Dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("favorites/removeFavorite/pending");
      expect(calls[1][0].type).toBe("favorites/removeFavorite/fulfilled");
      expect(calls[1][0].payload).toEqual({ placeId: "place1" });
    });
  });

  // Reducer action testleri
  describe("reducer actions", () => {
    test("handles clearFavorites", () => {
      const initialState = {
        favorites: [{ id: 1, place_id: "place1" }],
        isLoading: false,
        error: "Some error",
      };

      // clearFavorites action'ının state'i doğru güncellediğini kontrol ediyoruz
      expect(favoritesReducer(initialState, clearFavorites())).toEqual({
        favorites: [],
        isLoading: false,
        error: null,
      });
    });
  });
});
