import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NativeBaseProvider } from 'native-base';
import Splash from './Screens/Splash';

const NativeStack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <NativeStack.Navigator screenOptions={{headerShown: false}}>
          <NativeStack.Screen name="Splash" component={Splash}/>
          <NativeStack.Screen name="Welcome Screen" component={Splash} />
        </NativeStack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;