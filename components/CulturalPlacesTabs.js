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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 0,
    shadowOpacity: 0,
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
    width: width / 8,
    marginLeft: width / 7,
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
