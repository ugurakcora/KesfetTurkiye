import React from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";
import { culturalPlaces } from "../data/dummyData";
import PlaceCard from "../components/PlaceCard";
import CulturalPlacesTabs from "../components/CulturalPlacesTabs";
import { useTabAnimation } from "../hooks/useTabAnimation";

const CulturalPlaces = ({ route, navigation }) => {
  const { cityCode } = route.params;
  const places = culturalPlaces[cityCode] || [];
  const { slideAnim, handleTabPress } = useTabAnimation();

  const renderPlaces = (type) => {
    const filteredPlaces = places.filter((place) => place.type === type);
    return (
      <ScrollView style={styles.container}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <PlaceCard
              key={index}
              place={place}
              onPress={() => navigation.navigate("PlaceDetails", { place })}
            />
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
      <CulturalPlacesTabs onTabPress={handleTabPress}>
        {renderPlaces}
      </CulturalPlacesTabs>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eaeaea",
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
});

export default CulturalPlaces;
