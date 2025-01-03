import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Linking,
  Animated,
} from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FAQ_DATA = [
  {
    question: "Keşfet Türkiye nedir?",
    answer:
      "Keşfet Türkiye, Türkiye'nin kültürel mirasını, tarihi yerlerini ve doğal güzelliklerini keşfetmenizi sağlayan bir mobil uygulamadır.",
  },
  {
    question: "Favorilere nasıl eklerim?",
    answer:
      "Beğendiğiniz yerlerin detay sayfasında veya listelerde bulunan kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz. Favorilere ekleme yapabilmek için giriş yapmanız gerekmektedir.",
  },
  {
    question: "Konumumu nasıl güncellerim?",
    answer:
      "Ana sayfada bulunan konum ikonuna tıklayarak konumunuzu güncelleyebilirsiniz. Konum servislerinin açık olduğundan emin olun.",
  },
  {
    question: "Hesabımı nasıl silebilirim?",
    answer:
      "Profil sayfanızdan ayarlar bölümüne giderek hesap silme işlemini gerçekleştirebilirsiniz. Bu işlem geri alınamaz.",
  },
];

const CONTACT_OPTIONS = [
  {
    id: "email",
    title: "E-posta",
    subtitle: "destek@kesfetturkiye.com",
    icon: "mail",
    action: () => Linking.openURL("mailto:destek@kesfetturkiye.com"),
  },
  {
    id: "phone",
    title: "Telefon",
    subtitle: "0850 123 45 67",
    icon: "phone",
    action: () => Linking.openURL("tel:08501234567"),
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    subtitle: "WhatsApp üzerinden destek alın",
    icon: "whatsapp",
    type: "font-awesome",
    action: () => Linking.openURL("https://wa.me/908501234567"),
  },
];

const AccordionItem = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{item.question}</Text>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          type="material-community"
          size={24}
          color="#666"
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const HelpScreen = () => {
  const insets = useSafeAreaInsets();

  const renderContactOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.contactOption}
      onPress={option.action}
      activeOpacity={0.7}
    >
      <View style={styles.contactIconContainer}>
        <Icon
          name={option.icon}
          type={option.type || "material"}
          size={24}
          color="#FF385C"
        />
      </View>
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
      </View>
      <Icon name="chevron-right" type="material" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Yardım</Text>
        <Text style={styles.subtitle}>Size nasıl yardımcı olabiliriz?</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sıkça Sorulan Sorular</Text>
          {FAQ_DATA.map((item, index) => (
            <AccordionItem key={index} item={item} index={index} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bizimle İletişime Geçin</Text>
          <View style={styles.contactContainer}>
            {CONTACT_OPTIONS.map(renderContactOption)}
          </View>
        </View>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  accordionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
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
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  accordionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  contactContainer: {
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
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff5f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default HelpScreen;
