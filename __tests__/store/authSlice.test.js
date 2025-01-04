import authReducer, {
  loginUser,
  signupUser,
  logoutUser,
  checkUser,
  clearError,
} from "../../store/authSlice";
import { supabase } from "../../config/supabase";

// Supabase auth metodlarını mock'luyoruz
jest.mock("../../config/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

describe("Auth Slice", () => {
  // Her test öncesi mock'ları sıfırlıyoruz
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Initial state testi
  test("should return the initial state", () => {
    expect(authReducer(undefined, { type: undefined })).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  // Login işlemi testleri
  describe("loginUser", () => {
    // Başarılı login testi
    test("handles successful login", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const dispatch = jest.fn();
      const thunk = loginUser({
        email: "test@example.com",
        password: "password",
      });
      await thunk(dispatch);

      // Dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("auth/login/pending");
      expect(calls[1][0].type).toBe("auth/login/fulfilled");
      expect(calls[1][0].payload.user).toEqual(mockUser);
    });

    // Başarısız login testi
    test("handles login failure", async () => {
      const errorMessage = "Invalid credentials";
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: new Error(errorMessage),
      });

      const dispatch = jest.fn();
      const thunk = loginUser({ email: "test@example.com", password: "wrong" });
      await thunk(dispatch);

      // Hata durumunda dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("auth/login/pending");
      expect(calls[1][0].type).toBe("auth/login/rejected");
      expect(calls[1][0].payload).toBe(errorMessage);
    });
  });

  // Signup işlemi testleri
  describe("signupUser", () => {
    // Başarılı kayıt testi
    test("handles successful signup", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const dispatch = jest.fn();
      const thunk = signupUser({
        email: "test@example.com",
        password: "password",
      });
      await thunk(dispatch);

      // Dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("auth/signup/pending");
      expect(calls[1][0].type).toBe("auth/signup/fulfilled");
      expect(calls[1][0].payload.user).toEqual(mockUser);
    });
  });

  // Logout işlemi testi
  describe("logoutUser", () => {
    test("handles successful logout", async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });

      const dispatch = jest.fn();
      const thunk = logoutUser();
      await thunk(dispatch);

      // Dispatch çağrılarını kontrol ediyoruz
      const { calls } = dispatch.mock;
      expect(calls[0][0].type).toBe("auth/logout/pending");
      expect(calls[1][0].type).toBe("auth/logout/fulfilled");
    });
  });

  // Reducer action testleri
  describe("reducer actions", () => {
    test("handles clearError", () => {
      const initialState = {
        user: null,
        isLoading: false,
        error: "Some error",
        isAuthenticated: false,
      };

      // clearError action'ının state'i doğru güncellediğini kontrol ediyoruz
      expect(authReducer(initialState, clearError())).toEqual({
        ...initialState,
        error: null,
      });
    });
  });
});
