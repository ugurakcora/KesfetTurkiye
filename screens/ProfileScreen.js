import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MENU_ITEMS = [
  {
    id: "favorites",
    title: "Favorilerim",
    icon: "favorite-border",
    type: "material",
    screen: "Favorites",
    params: { fromProfile: true },
  },
  {
    id: "help",
    title: "Yardım",
    icon: "help-outline",
    type: "material",
    screen: "Help",
  },
  {
    id: "about",
    title: "Hakkımızda",
    icon: "info-outline",
    type: "material",
    screen: "About",
  },
  {
    id: "logout",
    title: "Çıkış Yap",
    icon: "logout",
    type: "material",
    color: "#FF385C",
  },
];

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state) => state.auth);
  console.log("user:", user);

  const handleMenuPress = (item) => {
    if (item.id === "logout") {
      Alert.alert(
        "Çıkış Yap",
        "Çıkış yapmak istediğinizden emin misiniz?",
        [
          {
            text: "İptal",
            style: "cancel",
          },
          {
            text: "Çıkış Yap",
            style: "destructive",
            onPress: () => dispatch(logoutUser()),
          },
        ],
        { cancelable: true }
      );
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIconContainer,
            item.color && { backgroundColor: item.color + "15" },
          ]}
        >
          <Icon
            name={item.icon}
            type={item.type}
            size={24}
            color={item.color || "#333"}
          />
        </View>
        <Text
          style={[styles.menuItemText, item.color && { color: item.color }]}
        >
          {item.title}
        </Text>
      </View>
      {!item.color && (
        <Icon name="chevron-right" type="material" size={24} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.user_metadata?.full_name
                  ? user?.user_metadata?.full_name
                      .split(" ")
                      .slice(0, 2)
                      .map((name) => name.charAt(0).toUpperCase())
                      .join("")
                  : user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.user_metadata?.full_name
                  ? user?.user_metadata?.full_name
                  : user?.email}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text style={styles.editButtonText}>Profili Düzenle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {MENU_ITEMS.map(renderMenuItem)}
        </View>

        <Text style={styles.versionText}>Versiyon 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  editButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  versionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
