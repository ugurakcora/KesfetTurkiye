import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  SafeAreaView,
  Platform,
} from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { version } from "../package.json";

const SOCIAL_LINKS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    type: "font-awesome",
    url: "https://instagram.com/kesfetturkiye",
    color: "#E1306C",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "twitter",
    type: "font-awesome",
    url: "https://twitter.com/kesfetturkiye",
    color: "#1DA1F2",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    type: "font-awesome",
    url: "https://facebook.com/kesfetturkiye",
    color: "#4267B2",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    type: "font-awesome",
    url: "https://youtube.com/kesfetturkiye",
    color: "#FF0000",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Ahmet Yılmaz",
    role: "Kurucu & CEO",
    // image: require("../assets/team/ahmet.png"),
    image: require("../assets/logo.png"),
  },
  {
    name: "Ayşe Demir",
    role: "Tasarım Direktörü",
    //image: require("../assets/team/ayse.png"),
    image: require("../assets/logo.png"),
  },
  {
    name: "Mehmet Kaya",
    role: "Teknoloji Direktörü",
    //image: require("../assets/team/mehmet.png"),
    image: require("../assets/logo.png"),
  },
];

const AboutScreen = () => {
  const insets = useSafeAreaInsets();

  const openSocialLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("URL açılamadı:", err));
  };

  const renderSocialLink = (link) => (
    <TouchableOpacity
      key={link.id}
      style={styles.socialButton}
      onPress={() => openSocialLink(link.url)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.socialIconContainer,
          { backgroundColor: link.color + "15" },
        ]}
      >
        <Icon name={link.icon} type={link.type} size={24} color={link.color} />
      </View>
      <Text style={styles.socialText}>{link.name}</Text>
      <Icon name="chevron-right" type="material" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderTeamMember = (member, index) => (
    <View key={index} style={styles.teamMember}>
      <Image source={member.image} style={styles.teamMemberImage} />
      <Text style={styles.teamMemberName}>{member.name}</Text>
      <Text style={styles.teamMemberRole}>{member.role}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Hakkımızda</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appVersion}>Versiyon {version}</Text>
          </View>

          <Text style={styles.description}>
            Keşfet Türkiye, ülkemizin zengin kültürel mirasını, tarihi yerlerini
            ve doğal güzelliklerini keşfetmenizi sağlayan bir mobil uygulamadır.
            Amacımız, Türkiye'nin eşsiz değerlerini teknoloji ile buluşturarak,
            kullanıcılarımıza benzersiz bir keşif deneyimi sunmaktır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ekibimiz</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teamContainer}
          >
            {TEAM_MEMBERS.map(renderTeamMember)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bizi Takip Edin</Text>
          <View style={styles.socialContainer}>
            {SOCIAL_LINKS.map(renderSocialLink)}
          </View>
        </View>

        <TouchableOpacity
          style={styles.privacyButton}
          onPress={() => Linking.openURL("https://kesfetturkiye.com/gizlilik")}
        >
          <Text style={styles.privacyButtonText}>Gizlilik Politikası</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  appInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  teamContainer: {
    paddingHorizontal: 5,
  },
  teamMember: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 120,
  },
  teamMemberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  teamMemberRole: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  socialContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  socialText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  privacyButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginTop: 10,
  },
  privacyButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

export default AboutScreen;
