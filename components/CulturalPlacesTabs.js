import React from "react";
import { View, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const CulturalPlacesTabs = ({ children, onTabPress }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: Platform.OS === "ios" ? 0 : 8,
        },
        tabBarStyle: {
          backgroundColor: "white",
          height: Platform.OS === "ios" ? 85 : 70,
          paddingTop: Platform.OS === "ios" ? 15 : 12,
          paddingHorizontal: 16,
          position: "absolute",
          bottom: Platform.OS === "ios" ? 30 : 25,
          left: 20,
          right: 20,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#FF385C",
        tabBarInactiveTintColor: "rgba(0,0,0,0.4)",
      }}
      screenListeners={{
        tabPress: onTabPress,
      }}
    >
      <Tab.Screen
        name="Tarihi"
        children={() => children("historical")}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Icon name="account-balance" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Doğa"
        children={() => children("natural")}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Icon name="nature" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Yemek"
        children={() => children("food")}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Icon name="restaurant" color={color} size={24} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = {
  iconWrapper: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
};

export default CulturalPlacesTabs;
