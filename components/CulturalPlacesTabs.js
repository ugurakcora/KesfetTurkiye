import React from "react";
import { View, Platform, StyleSheet, Dimensions, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get("window");

const CulturalPlacesTabs = ({ children, onTabPress }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIndicatorStyle: styles.indicator,
        tabBarActiveTintColor: "#FF385C",
        tabBarInactiveTintColor: "#666",
        tabBarPressColor: "transparent",
        tabBarShowIcon: true,
        swipeEnabled: true,
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
              <Icon name="account-balance" color={color} size={22} />
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
              <Icon name="nature" color={color} size={22} />
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
              <Icon name="restaurant" color={color} size={22} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    elevation: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 0,
    height: 80,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "none",
    marginTop: 0,
  },
  indicator: {
    backgroundColor: "#FF385C",
    height: 3,
    borderRadius: 3,
    width: width / 9,
    marginLeft: width / 9,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});

export default CulturalPlacesTabs;
