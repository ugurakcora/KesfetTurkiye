import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="person-circle-outline"
          type="ionicon"
          size={100}
          color="#FF385C"
        />
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" type="material" size={24} color="#666" />
          <Text style={styles.menuText}>Ayarlar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help" type="material" size={24} color="#666" />
          <Text style={styles.menuText}>Yardım</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info" type="material" size={24} color="#666" />
          <Text style={styles.menuText}>Hakkında</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" type="material" size={24} color="white" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 50,
  },
  email: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF385C",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ProfileScreen;
