import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import CountryAndCitySelect from "../screens/CountryAndCitySelect";
import CulturalPlaces from "../screens/CulturalPlaces";
import PlaceDetails from "../screens/PlaceDetails";
import EditProfileScreen from "../screens/EditProfileScreen";
import HelpScreen from "../screens/HelpScreen";
import AboutScreen from "../screens/AboutScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
        <Stack.Screen name="CulturalPlaces" component={CulturalPlaces} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="CountryAndCitySelect"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="CountryAndCitySelect"
        component={CountryAndCitySelect}
      />
      <Stack.Screen name="CulturalPlaces" component={CulturalPlaces} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
