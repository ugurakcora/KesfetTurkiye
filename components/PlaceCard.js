import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

const PlaceCard = ({ place, onPress }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (user && favorites) {
      const isPlaceFavorite = favorites.some(
        (fav) => fav.place_id === place.id
      );
      setIsFavorite(isPlaceFavorite);
    }
  }, [favorites, place.id, user]);

  const handleFavorite = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const isPlaceFavorite = favorites?.some((fav) => fav.place_id === place.id);

    if (isPlaceFavorite) {
      dispatch(removeFavorite({ userId: user.id, placeId: place.id }));
    } else {
      dispatch(
        addFavorite({
          userId: user.id,
          placeId: place.id,
          placeData: place,
        })
      );
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: place.image }} style={styles.image} />
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
        <Icon
          name={isFavorite ? "favorite" : "favorite-border"}
          type="material"
          size={24}
          color={isFavorite ? "#FF385C" : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {place.description}
        </Text>
      </View>

      <Modal
        isVisible={showLoginModal}
        onBackdropPress={() => setShowLoginModal(false)}
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
              setShowLoginModal(false);
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.signupButton]}
            onPress={() => {
              setShowLoginModal(false);
              navigation.navigate("Signup");
            }}
          >
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favoriteButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#FF385C",
  },
  signupButton: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlaceCard;
