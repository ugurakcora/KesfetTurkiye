import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import CulturalPlaces from "../screens/CulturalPlaces";
import PlaceDetails from "../screens/PlaceDetails";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
          <Stack.Screen name="CulturalPlaces" component={CulturalPlaces} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
