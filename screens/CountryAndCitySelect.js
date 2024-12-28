import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ImageBackground, 
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SelectBox from '../components/SelectBox';
import { cities, culturalPlaces } from '../data/dummyData';
import { translate } from '../translations';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getDistance } from 'geolib';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export default function CountryAndCitySelect() {
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [address, setAddress] = useState({
    district: '',
    city: ''
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Konum izni reddedildi');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Reverse Geocoding
        const { latitude, longitude } = location.coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });

        if (response && response[0]) {
          setAddress({
            district: response[0].district || response[0].subregion || '',
            city: response[0].city || ''
          });
        }

      } catch (error) {
        console.error('Konum alınamadı:', error);
        setErrorMsg('Konum alınamadı');
      }
    })();
  }, []);

  // Mock nearby places - gerçek uygulamada API'den gelecek
  useEffect(() => {
    if (location) {
      // Örnek olarak İstanbul'daki bazı yerleri gösteriyoruz
      const nearby = Object.values(culturalPlaces['34']).slice(0, 5);
      setNearbyPlaces(nearby);
    }
  }, [location]);

  const renderNearbyPlace = (place) => {
    const distance = location ? getDistance(
      { latitude: location.coords.latitude, longitude: location.coords.longitude },
      { latitude: place.latitude, longitude: place.longitude }
    ) / 1000 : 0;

    return (
      <TouchableOpacity 
        key={place.name}
        style={styles.card}
        onPress={() => navigation.navigate('PlaceDetails', { place })}
      >
        <Image
          source={{ uri: place.image }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{place.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.cardLocation} numberOfLines={1}>{place.location}</Text>
          </View>
          <Text style={styles.distanceText}>{distance.toFixed(2)} km</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#00B4DB', '#0083B0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Location Header */}
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

        {/* City Selection */}
        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Nereyi keşfetmek istersiniz?</Text>
          <SelectBox
            data={cities.TR}
            value={selectedCity}
            onSelect={(city) => {
              setSelectedCity(city);
              navigation.navigate('CulturalPlaces', { 
                cityCode: city.toString()
              });
            }}
            placeholder="Şehir seçin"
          />
        </View>

        {/* Nearby Places */}
        <View style={styles.nearbyContainer}>
          <Text style={styles.nearbyTitle}>Yakınınızdaki Yerler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {nearbyPlaces.map(renderNearbyPlace)}
          </ScrollView>
        </View>

        {/* Bottom padding için boş view */}
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
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    marginBottom: 20,
  },
  currentLocationLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  selectContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  nearbyContainer: {
    marginBottom: 20,
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  cardsContainer: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 12,
    marginLeft: 15,
    shadowColor: '#000',
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
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#FF385C',
    marginLeft: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  }
});