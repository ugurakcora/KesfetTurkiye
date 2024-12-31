import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavorites } from "../store/favoritesSlice";
import PlaceCard from "../components/PlaceCard";
import { Icon } from "react-native-elements";

const { width } = Dimensions.get("window");

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites, isLoading, error } = useSelector(
    (state) => state.favorites
  );

  console.log("Favoriler knk:", favorites);

  // Animation value for fade in
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fetch favorites when component mounts
    if (user) {
      dispatch(fetchUserFavorites(user.id));
    }

    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [user]);

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="favorite-border"
        type="material"
        size={80}
        color="#FF385C"
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>Henüz Favori Yeriniz Yok</Text>
      <Text style={styles.emptyText}>
        Beğendiğiniz yerleri favorilerinize ekleyerek daha sonra kolayca
        ulaşabilirsiniz.
      </Text>
    </View>
  );

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" type="material" size={60} color="#FF385C" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render empty state if no favorites
  if (!favorites || favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorilerim</Text>
          <Text style={styles.subtitle}>0 favori yeriniz bulunuyor</Text>
        </View>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorilerim</Text>
          <Text style={styles.subtitle}>
            {favorites.length} favori yeriniz bulunuyor
          </Text>
        </View>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id || item.place_id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <PlaceCard
                place={item.place_data}
                onPress={() =>
                  navigation.navigate("PlaceDetails", {
                    place: item.place_data,
                  })
                }
              />
            </View>
          )}
          contentContainerStyle={[
            styles.listContainer,
            { minHeight: favorites.length === 0 ? height - 200 : "auto" },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  cardContainer: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default FavoritesScreen;
