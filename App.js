import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CitySelect from './screens/CountryAndCitySelect';
import CulturalPlaces from './screens/CulturalPlaces';
import PlaceDetails from './screens/PlaceDetails';
import { translate } from './translations';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={CitySelect} 
          options={{ 
            headerShown: false // Başlığı gizle
          }}
        />
        <Stack.Screen 
          name="CulturalPlaces" 
          component={CulturalPlaces} 
          options={{
            headerTransparent: false,
            headerTintColor: '#000', // Geri butonunun rengi siyah
            headerTitle: translate('culturalPlaces'),
            headerBackTitle: translate('back'),
            headerShadowVisible: true,
            headerBlurEffect: 'light',
            headerBackTitleStyle: { color: '#000' }, // Geri butonunun yazı rengi siyah
          }}
        />
        <Stack.Screen 
          name="PlaceDetails" 
          component={PlaceDetails} 
          options={{
            headerTransparent: true,
            headerTintColor: '#000', // Geri butonunun rengi siyah
            headerTitle: '',
            headerBackTitle: translate('back'),
            headerShadowVisible: false,
            headerBlurEffect: 'dark',
            headerBackTitleStyle: { color: '#000' }, // Geri butonunun yazı rengi siyah
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}