import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';

import { Home, Manual, Setting } from './src/screens'

admob()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.G,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: false,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: false,
  })
  .then(() => {
    // Request config successfully set!
  });

enableScreens();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle='light-content' backgroundColor={'transparent'} translucent={true} />
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Manual' component={Manual} />
        <Stack.Screen name='Setting' component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
