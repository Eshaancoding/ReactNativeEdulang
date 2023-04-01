import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NativeBaseProvider } from 'native-base';
import Splash from './screens/Splash';

const Tab = createBottomTabNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Tab.Navigator>
          <Tab.Screen name="Splash" component={Splash} />
        </Tab.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;