import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { culturalPlaces } from "../data/dummyData";
import PlaceCard from "../components/PlaceCard";
import CulturalPlacesTabs from "../components/CulturalPlacesTabs";
import { useTabAnimation } from "../hooks/useTabAnimation";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";
import Modal from "react-native-modal";

const CulturalPlaces = ({ route, navigation }) => {
  const { cityCode } = route.params;
  const places = culturalPlaces[cityCode] || [];
  const { slideAnim, handleTabPress } = useTabAnimation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFavorite = (place) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const placeId = place.id || place.name.toLowerCase().replace(/\s+/g, "-");
    const placeWithId = { ...place, id: placeId };

    console.log("Current place:", placeWithId);
    console.log("Current user:", user);
    console.log("Current favorites:", favorites);

    const isPlaceFavorite = favorites?.some((fav) => fav.place_id === placeId);
    console.log("Is place already favorite?", isPlaceFavorite);

    if (isPlaceFavorite) {
      console.log("Removing from favorites:", { userId: user.id, placeId });
      dispatch(removeFavorite({ userId: user.id, placeId }));
    } else {
      console.log("Adding to favorites:", {
        userId: user.id,
        placeId,
        placeData: placeWithId,
      });
      dispatch(
        addFavorite({
          userId: user.id,
          placeId,
          placeData: placeWithId,
        })
      );
    }
  };

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
              onFavorite={() => handleFavorite(place)}
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

      <Modal
        isVisible={showAuthModal}
        onBackdropPress={() => setShowAuthModal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Giriş Yapın</Text>
          <Text style={styles.modalText}>
            Favorilere eklemek için lütfen giriş yapın veya kayıt olun.
          </Text>
          <TouchableOpacity
            style={[styles.modalButton, styles.loginButton]}
            onPress={() => {
              setShowAuthModal(false);
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.signupButton]}
            onPress={() => {
              setShowAuthModal(false);
              navigation.navigate("Signup");
            }}
          >
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#007bff",
  },
  signupButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default CulturalPlaces;
