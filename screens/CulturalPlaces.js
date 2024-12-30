import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <PlaceCard
              key={index}
              place={place}
              onPress={() => navigation.navigate("PlaceDetails", { place })}
            />
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              Bu kategori için veri bulunmamaktadır.
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <CulturalPlacesTabs onTabPress={handleTabPress}>
        {renderPlaces}
      </CulturalPlacesTabs>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default CulturalPlaces;
