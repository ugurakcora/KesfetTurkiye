import React, { useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const PlaceDetails = ({ route }) => {
  const { place } = route.params;
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderImages = place.slider?.images || [place.image]; // Eğer slider yoksa ana görseli kullan

  const coordinates = {
    latitude: place.latitude || 41.0082,
    longitude: place.longitude || 28.9784,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sliderContainer}>
        <FlatList
          data={sliderImages}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.sliderImage}
            />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            const slide = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setActiveSlide(slide);
          }}
        />
        {sliderImages.length > 1 && (
          <View style={styles.pagination}>
            {sliderImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === activeSlide ? '#2196F3' : '#BBDEFB' }
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
        
        {place.moreDetails && (
          <View style={styles.moreDetailsContainer}>
            {place.moreDetails.history && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tarihçe</Text>
                <Text style={styles.sectionText}>{place.moreDetails.history}</Text>
              </View>
            )}

            {place.moreDetails.architecture && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mimari</Text>
                <Text style={styles.sectionText}>{place.moreDetails.architecture}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ziyaret Bilgileri</Text>
              <View style={styles.visitInfo}>
                <Text style={styles.visitInfoText}>
                  🕒 Ziyaret Saatleri: {place.moreDetails.visitInfo.hours}
                </Text>
                <Text style={styles.visitInfoText}>
                  💰 Giriş Ücreti: {place.moreDetails.visitInfo.price}
                </Text>
                <Text style={styles.visitInfoText}>
                  📅 En İyi Ziyaret Dönemi: {place.moreDetails.visitInfo.bestTime}
                </Text>
                <Text style={styles.visitInfoText}>
                  💡 İpuçları: {place.moreDetails.visitInfo.tips}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={coordinates}
          >
            <Marker
              coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
              }}
              title={place.name}
            />
          </MapView>
          
          <TouchableOpacity 
            style={styles.directionsButton}
            onPress={openInMaps}
          >
            <Text style={styles.directionsButtonText}>Yol Tarifi Al</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.location}>Adres: {place.location}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sliderContainer: {
    height: 300,
    width: '100%',
  },
  sliderImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginBottom: 10,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  moreDetailsContainer: {
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  visitInfo: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  visitInfoText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    lineHeight: 22,
  },
  mapContainer: {
    height: 200,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
  },
});

export default PlaceDetails; 