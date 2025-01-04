import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useSelector } from "react-redux";
import PlaceCard from "../../components/PlaceCard";

// Mock React Native components
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.Image = ({ source, style }) => ({
    type: "Image",
    props: { source, style },
  });
  RN.TouchableOpacity = ({ children, style, onPress }) => ({
    type: "TouchableOpacity",
    props: { style, onPress },
    children,
  });
  RN.View = ({ children, style }) => ({
    type: "View",
    props: { style },
    children,
  });
  RN.Text = ({ children, style }) => ({
    type: "Text",
    props: { style },
    children,
  });
  return RN;
});

// Mock react-native-elements
jest.mock("react-native-elements", () => ({
  Icon: ({ name, type, size, color }) => ({
    type: "Icon",
    props: { name, type, size, color },
  }),
}));

// Mock Redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock test data
const mockPlace = {
  id: "1",
  name: "Test Place",
  description: "Test Description",
  image: "https://test.com/image.jpg",
};

describe("PlaceCard Component", () => {
  // Her test öncesi mock state'i sıfırlıyoruz
  beforeEach(() => {
    useSelector.mockReset();
  });

  // Temel render testi - kartın doğru şekilde render edildiğini kontrol ediyoruz
  test("renders correctly with place data", () => {
    // Mock Redux state
    useSelector.mockImplementation((selector) =>
      selector({
        auth: { user: null },
        favorites: { favorites: [] },
      })
    );

    const { getByText } = render(<PlaceCard place={mockPlace} />);

    // Başlık ve açıklama metinlerinin doğru render edildiğini kontrol ediyoruz
    expect(getByText(mockPlace.name)).toBeTruthy();
    expect(getByText(mockPlace.description)).toBeTruthy();
  });

  // Favori durumu testi - favori ikonunun doğru renkte gösterildiğini kontrol ediyoruz
  test("shows correct favorite status", () => {
    // Favori olan bir yer için mock state
    useSelector.mockImplementation((selector) =>
      selector({
        auth: { user: { id: "user1" } },
        favorites: {
          favorites: [{ place_id: "1" }],
        },
      })
    );

    const { UNSAFE_getByType } = render(<PlaceCard place={mockPlace} />);
    const favoriteIcon = UNSAFE_getByType("Icon");

    // Favori ikonunun kırmızı renkte olduğunu kontrol ediyoruz
    expect(favoriteIcon.props.color).toBe("#FF385C");
  });

  // Giriş yapmamış kullanıcı testi - giriş modalının gösterildiğini kontrol ediyoruz
  test("shows login modal for unauthenticated user", () => {
    // Giriş yapmamış kullanıcı için mock state
    useSelector.mockImplementation((selector) =>
      selector({
        auth: { user: null },
        favorites: { favorites: [] },
      })
    );

    const { getByText, UNSAFE_getByType } = render(
      <PlaceCard place={mockPlace} />
    );
    const favoriteIcon = UNSAFE_getByType("Icon");

    // Favori butonuna tıklama
    fireEvent.press(favoriteIcon);

    // Login modalının gösterildiğini kontrol ediyoruz
    expect(getByText("Giriş Yapın")).toBeTruthy();
  });

  // Favori ekleme/çıkarma işlevi testi
  test("handles favorite toggle correctly", () => {
    const mockDispatch = jest.fn();
    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(mockDispatch);

    // Giriş yapmış kullanıcı için mock state
    useSelector.mockImplementation((selector) =>
      selector({
        auth: { user: { id: "user1" } },
        favorites: { favorites: [] },
      })
    );

    const { UNSAFE_getByType } = render(<PlaceCard place={mockPlace} />);
    const favoriteIcon = UNSAFE_getByType("Icon");

    // Favori butonuna tıklama
    fireEvent.press(favoriteIcon);

    // Dispatch fonksiyonunun çağrıldığını kontrol ediyoruz
    expect(mockDispatch).toHaveBeenCalled();
  });
});
