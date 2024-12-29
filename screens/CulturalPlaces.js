import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { culturalPlaces } from "../data/dummyData";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const CulturalPlaces = ({ route, navigation }) => {
  const { cityCode } = route.params;
  const places = culturalPlaces[cityCode] || [];
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateSlide = (index) => {
    setActiveTab(index);
    Animated.spring(slideAnim, {
      toValue: index * 85,
      useNativeDriver: true,
      tension: 68, 
      friction: 10, 
    }).start();
  };

  const renderPlaces = (type) => {
    const filteredPlaces = places.filter((place) => place.type === type);
    return (
      <ScrollView style={styles.container}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <TouchableOpacity
              key={index}
              style={styles.placeCard}
              onPress={() => navigation.navigate("PlaceDetails", { place })}
            >
              <Image source={{ uri: place.image }} style={styles.placeImage} />
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeDescription}>{place.description}</Text>
              <Text style={styles.placeLocation}>Konum: {place.location}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>
            Bu kategori için veri bulunmamaktadır.
          </Text>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  };

  return (
    <>
      <Animated.View
        style={[
          styles.activeBackground,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      />
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
          tabPress: (e) => {
            const tabIndex = ["Tarihi", "Doğa", "Yemek"].indexOf(
              e.target.split("-")[0]
            );
            animateSlide(tabIndex);
          },
        }}
      >
        <Tab.Screen
          name="Tarihi"
          children={() => renderPlaces("historical")}
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
          children={() => renderPlaces("natural")}
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
          children={() => renderPlaces("food")}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.iconWrapper}>
                <Icon name="restaurant" color={color} size={24} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eaeaea",
  },
  placeImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  placeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  placeDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  placeLocation: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  bottomPadding: {
    height: 120,
  },
  activeBackground: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "rgba(255,56,92,0.1)",
    borderRadius: 12,
    zIndex: 0,
    bottom: 12,
    left: 32,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default CulturalPlaces;
