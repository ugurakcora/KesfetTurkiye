import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SelectBox from "../components/SelectBox";
import { cities, culturalPlaces } from "../data/dummyData";
import { translate } from "../translations";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getDistance } from "geolib";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";
import Modal from "react-native-modal";
import { Icon } from "react-native-elements";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

const NearbyPlaces = ({ places, navigation, location }) => {
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

    const isPlaceFavorite = favorites?.some((fav) => fav.place_id === placeId);

    if (isPlaceFavorite) {
      dispatch(removeFavorite({ userId: user.id, placeId }));
    } else {
      dispatch(
        addFavorite({
          userId: user.id,
          placeId,
          placeData: placeWithId,
        })
      );
    }
  };

  const renderItem = ({ item }) => {
    const isPlaceFavorite = favorites?.some(
      (fav) =>
        fav.place_id ===
        (item.id || item.name.toLowerCase().replace(/\s+/g, "-"))
    );

    const distance = location
      ? getDistance(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          { latitude: item.latitude, longitude: item.longitude }
        ) / 1000
      : null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("PlaceDetails", { place: item })}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleFavorite(item)}
        >
          <Icon
            name={isPlaceFavorite ? "favorite" : "favorite-border"}
            type="material"
            size={24}
            color={isPlaceFavorite ? "#FF385C" : "#fff"}
          />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.cardLocation} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          {distance !== null && (
            <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.nearbyPlacesContainer}>
      <Text style={styles.sectionTitle}>Yakınınızdaki Yerler</Text>
      <FlatList
        data={places}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.nearbyPlacesList}
      />
      <Modal
        isVisible={showAuthModal}
        onBackdropPress={() => setShowAuthModal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Icon
            name="favorite"
            type="material"
            size={50}
            color="#FF385C"
            style={styles.modalIcon}
          />
          <Text style={styles.modalTitle}>Favorilere Ekle</Text>
          <Text style={styles.modalText}>
            Favori yerlerinizi kaydetmek için giriş yapın veya kayıt olun.
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
            <Text style={[styles.buttonText, styles.signupButtonText]}>
              Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default function CountryAndCitySelect() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);

  const [selectedCity, setSelectedCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [address, setAddress] = useState({
    district: "",
    city: "",
    region: "",
    locationString: "",
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Konum izni reddedildi");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Reverse Geocoding
        const { latitude, longitude } = location.coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (response && response[0]) {
          setAddress({
            district: response[0].district || response[0].subregion || "",
            city: response[0].city || "",
          });
        }
      } catch (error) {
        console.error("Konum alınamadı:", error);
        setErrorMsg("Konum alınamadı");
      }
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;

      (async () => {
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (response && response[0]) {
          const district = response[0].district || response[0].subregion;
          const city = response[0].city || "";
          const region = response[0].region || "";

          const locationString = `${district} / ${region}`;
          setAddress({
            district: district,
            city: city,
            region: region,
            locationString: locationString,
          });

          const cityValue = cities.TR.find(
            (cityObj) => cityObj.label === region
          )?.value;

          if (cityValue) {
            const nearby = Object.values(culturalPlaces[cityValue]).slice(0, 7);
            setNearbyPlaces(nearby);
          }
        }
      })();
    }
  }, [location]);

  return (
    <LinearGradient
      colors={["#C8102E", "#D3D3D3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.locationHeader}>
          <Text style={styles.currentLocationLabel}>CURRENT LOCATION</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color="#FF385C" />
            {errorMsg ? (
              <Text style={styles.errorText}>Konum alınamadı</Text>
            ) : !address.district && !address.city ? (
              <Text style={styles.loadingText}>Konum alınıyor...</Text>
            ) : (
              <Text style={styles.locationText}>
                {address.district} / {address.city}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Nereyi keşfetmek istersiniz?</Text>
          <SelectBox
            data={cities.TR}
            value={selectedCity}
            onSelect={(city) => {
              setSelectedCity(city);
              navigation.navigate("CulturalPlaces", {
                cityCode: city.toString(),
              });
            }}
            placeholder="Şehir seçin"
          />
        </View>

        {location && nearbyPlaces.length > 0 && (
          <NearbyPlaces
            places={nearbyPlaces}
            navigation={navigation}
            location={location}
          />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  locationHeader: {
    marginTop: Platform.OS === "ios" ? 50 : 30,
    marginBottom: 20,
  },
  currentLocationLabel: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 4,
  },
  selectContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 25,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 10,
  },
  nearbyPlacesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  nearbyPlacesList: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 12,
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 5,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 16,
    color: "#6c757d",
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 14,
    //color: '#FF385C',
    color: "#FFFFFF", // Rengi beyaz yaptım
    marginLeft: 4,
  },
  loadingText: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 4,
    fontStyle: "italic",
  },
  bottomPadding: {
    height: 40,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
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
