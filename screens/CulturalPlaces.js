import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { culturalPlaces } from '../data/dummyData';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../translations';

const CulturalPlaces = ({ route }) => {
  const { cityCode } = route.params;
  const places = culturalPlaces[cityCode] || [];
  const navigation = useNavigation();

  if (!places || places.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>
          {translate('notFound')} ({translate('code')}: {cityCode})
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {places.map((place, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.placeCard}
          onPress={() => navigation.navigate('PlaceDetails', { place })}
        >
            <Image 
            source={{ uri: place.image }} // Görseli ekle
            style={styles.placeImage} // Stil ekle
          />
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeDescription}>{place.description}</Text>
          <Text style={styles.placeLocation}>Konum: {place.location}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
    placeImage: {
    width: '100%', // Görselin genişliği
    height: 200, // Görselin yüksekliği
    borderRadius: 8, // Kenar yuvarlama
    marginBottom: 8, // Alt boşluk
  },
  placeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  placeLocation: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CulturalPlaces; 