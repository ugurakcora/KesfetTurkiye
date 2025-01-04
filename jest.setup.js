// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock Expo modules
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 41.0082,
      longitude: 28.9784,
    },
  }),
}));

// Mock navigation
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Mock Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

// Mock Image component
jest.mock("react-native/Libraries/Image/Image", () => ({
  resolveAssetSource: jest.fn(),
}));

// Mock Platform
jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  select: jest.fn(),
}));

// Mock react-native-modal
jest.mock("react-native-modal", () => {
  const React = require("react");
  return function Modal({ children, isVisible, onBackdropPress }) {
    if (!isVisible) return null;
    return React.createElement("View", { testID: "modal" }, children);
  };
});
