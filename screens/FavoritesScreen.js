import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
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

  useEffect(() => {
    if (user) {
      dispatch(fetchUserFavorites(user.id));
    }
  }, [user]);

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" type="material" size={60} color="#FF385C" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
          <PlaceCard
            place={item.place_data}
            onPress={() =>
              navigation.navigate("PlaceDetails", {
                place: item.place_data,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 60,
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
