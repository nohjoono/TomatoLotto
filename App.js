import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { Home, Manual } from './src/screens'


enableScreens();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle='dark-content' backgroundColor={'transparent'} translucent={true} />
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Manual' component={Manual} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
