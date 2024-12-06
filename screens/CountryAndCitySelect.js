import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SelectBox from '../components/SelectBox';
import { cities } from '../data/dummyData';
import { translate } from '../translations';

export default function CitySelect() {  // İsmi de güncelledik
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <ImageBackground 
      source={require('../assets/p.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{translate('homepageTitle')}</Text>
        
        <View style={styles.selectContainer}>
          <SelectBox
            label={translate('citySelect.label')}
            data={cities.TR}  // Direkt Türkiye şehirlerini gösteriyoruz
            value={selectedCity}
            onSelect={(city) => {
              console.log('Seçilen şehir:', city);
              setSelectedCity(city);
              navigation.navigate('CulturalPlaces', { 
                cityCode: city.toString()
              });
            }}
            placeholder={translate('citySelect.placeholder')}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28, // Yazı boyutunu artır
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40, // Alt boşluğu artır
    color: 'rgba(255, 255, 255, 0.9)', // Beyaz rengi daha belirgin hale getir
    textShadowColor: 'rgba(0, 0, 0, 1)', // Gölge rengi siyah
    textShadowOffset: { width: 2, height: 2 }, // Gölge ofsetini artır
    textShadowRadius: 10, // Gölge yayılmasını artır
  },
  selectContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  background: {
    flex: 1,
  },
});