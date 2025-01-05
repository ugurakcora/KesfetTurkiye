import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavorites, removeFavorite } from "../store/favoritesSlice";
import PlaceCard from "../components/PlaceCard";
import { Icon } from "react-native-elements";
import { cities } from "../data/dummyData";

const { width, height } = Dimensions.get("window");

const CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "historical", label: "Tarihi" },
  { id: "museum", label: "Müze" },
  { id: "nature", label: "Doğal" },
  { id: "religious", label: "Dini" },
];

const FilterChip = ({ label, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.filterChipSelected]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterChipText,
        isSelected && styles.filterChipTextSelected,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites, isLoading, error } = useSelector(
    (state) => state.favorites
  );

  const [selectedCities, setSelectedCities] = useState(["all"]);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserFavorites(user.id));
    }
  }, [user]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) => {
      if (categoryId === "all") {
        return ["all"];
      }
      const newSelection = prev.filter((id) => id !== "all");
      if (prev.includes(categoryId)) {
        const filtered = newSelection.filter((id) => id !== categoryId);
        return filtered.length === 0 ? ["all"] : filtered;
      }
      return [...newSelection, categoryId];
    });
  };

  const handleCitySelect = (cityId) => {
    setSelectedCities((prev) => {
      if (cityId === "all") {
        return ["all"];
      }
      const newSelection = prev.filter((id) => id !== "all");
      if (prev.includes(cityId)) {
        const filtered = newSelection.filter((id) => id !== cityId);
        return filtered.length === 0 ? ["all"] : filtered;
      }
      return [...newSelection, cityId];
    });
  };

  useEffect(() => {
    if (favorites) {
      let filtered = [...favorites];

      if (!selectedCities.includes("all")) {
        filtered = filtered.filter((item) =>
          selectedCities.includes(item.place_data.city)
        );
      }

      if (!selectedCategories.includes("all")) {
        filtered = filtered.filter((item) =>
          selectedCategories.includes(item.place_data.category)
        );
      }

      setFilteredFavorites(filtered);
    }
  }, [favorites, selectedCities, selectedCategories]);

  const handleFavorite = (place) => {
    const placeId = place.name.toLowerCase().replace(/\s+/g, "-");
    dispatch(removeFavorite({ userId: user.id, placeId }));
  };

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
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "CountryAndCitySelect" }],
          });
        }}
      >
        <Text style={styles.exploreButtonText}>Yerleri Keşfet</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Favorilerim</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter-list" type="material" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        {filteredFavorites.length} favori yeriniz bulunuyor
      </Text>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtrele</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilters(false)}
            >
              <Icon name="close" type="material" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScrollView}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Kategori</Text>
              <View style={styles.filterChipsContainer}>
                {CATEGORIES.map((category) => (
                  <FilterChip
                    key={category.id}
                    label={category.label}
                    isSelected={selectedCategories.includes(category.id)}
                    onPress={() => handleCategorySelect(category.id)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Şehir</Text>
              <View style={styles.filterChipsContainer}>
                <FilterChip
                  label="Tümü"
                  isSelected={selectedCities.includes("all")}
                  onPress={() => handleCitySelect("all")}
                />
                {cities.TR.map((city) => (
                  <FilterChip
                    key={city.value}
                    label={city.label}
                    isSelected={selectedCities.includes(city.value)}
                    onPress={() => handleCitySelect(city.value)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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

  if (!filteredFavorites || filteredFavorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderFilterModal()}
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <PlaceCard
            place={{
              ...item.place_data,
              id: item.place_data.name.toLowerCase().replace(/\s+/g, "-"),
            }}
            onPress={() =>
              navigation.navigate("PlaceDetails", {
                place: {
                  ...item.place_data,
                  id: item.place_data.name.toLowerCase().replace(/\s+/g, "-"),
                },
              })
            }
            onFavorite={() => handleFavorite(item.place_data)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
      />
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  filterButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  closeButton: {
    padding: 8,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  filterScrollView: {
    maxHeight: height * 0.6,
  },
  filterSection: {
    padding: 20,
    paddingTop: 15,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    margin: 4,
  },
  filterChipSelected: {
    backgroundColor: "#FF385C",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
  },
  filterChipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#FF385C",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: "#FF385C",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FavoritesScreen;
