import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../store/userSlice";
import { supabase } from "../config/supabase";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user);

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const file = result.assets[0];
        const fileExt = file.uri.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Convert image to blob
        const response = await fetch(file.uri);
        const blob = await response.blob();

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
          error: urlError,
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        if (urlError) throw urlError;

        setAvatar(publicUrl);
        await handleSave(fullName, publicUrl);
      }
    } catch (error) {
      Alert.alert("Hata", "Fotoğraf yüklenirken bir hata oluştu");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (name, avatarUrl = avatar) => {
    try {
      const updatedMetadata = {
        ...user.user_metadata,
        full_name: name,
        avatar_url: avatarUrl,
      };

      await dispatch(updateUserProfile(updatedMetadata)).unwrap();
      if (!avatarUrl) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Hata", "Profil güncellenirken bir hata oluştu");
      console.error("Profile update error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Profili Düzenle</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSave(fullName)}
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleImagePick}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#FF385C" />
          ) : avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {fullName
                  ? fullName
                      .split(" ")
                      .slice(0, 2)
                      .map((name) => name.charAt(0).toUpperCase())
                      .join("")
                  : user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Icon name="camera-alt" type="material" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ad Soyad"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FF385C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 30,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF385C",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
});

export default EditProfileScreen;
