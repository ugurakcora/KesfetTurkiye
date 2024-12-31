import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import CountryAndCitySelect from "../screens/CountryAndCitySelect";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FF385C",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Anasayfa"
        component={CountryAndCitySelect}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="material" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoriler"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="favorite" type="material" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" type="material" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
