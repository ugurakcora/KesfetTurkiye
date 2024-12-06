// translations.js
import * as Localization from 'expo-localization';

const translations = {
  en: {
    citySelect: {
      label: "City Selection",
      placeholder: "Select a city"
    },
    culturalPlaces: "Cultural Places",
    homepageTitle: "Discover Cultural Places",
    notFound: "Cultural place information has not been added for this city yet.",
    code: "Code"
  }, 
  tr: {
    citySelect: {
      label: "Şehir Seçimi",
      placeholder: "Şehir seçiniz"
    },
    culturalPlaces: "Kültürel Yerler",
    homepageTitle: "Kültürel Yerleri Keşfet",
    notFound: "Bu şehir için henüz kültürel yer bilgisi eklenmemiş.",
    code: "Kod"
  },
};

// Cihazın dilini tespit et
const getDeviceLanguage = () => {
  const language = Localization.locale.split('-')[0]; // 'tr' veya 'en' gibi
  return language === 'tr' ? 'tr' : 'en'; // Türkçe ise 'tr', değilse 'en' döner
};

export const translate = (key) => {
  const language = getDeviceLanguage();
  const keys = key.split('.');
  let translation = translations[language];

  keys.forEach((k) => {
    translation = translation?.[k];
  });

  return translation || key; // Eğer çeviri bulunamazsa anahtarı döner
};
