import React, { lazy, Suspense } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { culturalPlaces } from "../data/dummyData";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const CulturalPlaces = ({ route, navigation }) => {
  const { cityCode } = route.params;
  const places = culturalPlaces[cityCode] || [];

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
        {/* Bottom padding için boş view */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Tüm ekranlar için başlıkları gizler
      }}
    >
      <Tab.Screen
        name="Historical"
        children={() => renderPlaces("historical")}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Natural"
        children={() => renderPlaces("natural")}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="nature" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Food"
        children={() => renderPlaces("food")}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="restaurant" color={color} size={size} />
          ),
        }}
      />
      {/* Diğer türler için ekleyin */}
    </Tab.Navigator>
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
    height: 20,
  }
});

export default CulturalPlaces;
