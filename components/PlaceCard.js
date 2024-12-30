import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const PlaceCard = ({ place, onPress }) => {
  return (
    <TouchableOpacity style={styles.placeCard} onPress={onPress}>
      <Image source={{ uri: place.image }} style={styles.placeImage} />
      <Text style={styles.placeName}>{place.name}</Text>
      <Text style={styles.placeDescription}>{place.description}</Text>
      <Text style={styles.placeLocation}>Konum: {place.location}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  placeImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
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
});

export default PlaceCard;
