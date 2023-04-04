import 'react-native-gesture-handler'
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NativeBaseProvider } from 'native-base';

// atom 
import { useAtom } from 'jotai';
import { isAdminAtom } from './Storage/UserStorage';

// screen imports
import Splash from './screens/Splash';
import WelcomeScreen from './screens/Login/WelcomeScreen';
import Home from './screens/HomeTab/Home';
import Settings from './screens/Settings';
import LibraryHome from './screens/LibraryTab/LibraryHome';
import BookInfo from './screens/SharedScreens/BookInfo';
import BookReader from './screens/SharedScreens/BookReader';

// Admin navigator
const AdminScreenNavigator = createNativeStackNavigator();
function AdminScreen(): JSX.Element {
  return (
    <AdminScreenNavigator.Navigator>
      <AdminScreenNavigator.Screen name="Admin Page" component={Home} />
      <AdminScreenNavigator.Screen name="Add Book: Info" component={BookInfo} />
      <AdminScreenNavigator.Screen name="Add PDF" component={Home} />
    </AdminScreenNavigator.Navigator>
  )
}

// Library navigator
const LibraryScreenNavigator = createNativeStackNavigator();
function LibraryScreen(): JSX.Element {
  return (
    <LibraryScreenNavigator.Navigator>
      <HomeScreenNavigator.Screen name="Library Home Page" component={LibraryHome} />
      <HomeScreenNavigator.Screen name="Book Info" component={BookInfo} />
      <HomeScreenNavigator.Screen name="Book Reader" component={BookReader} />
    </LibraryScreenNavigator.Navigator>
  )
}

// Home navigator
const HomeScreenNavigator = createNativeStackNavigator();
function HomeScreen(): JSX.Element {
  return (
    <HomeScreenNavigator.Navigator>
      <HomeScreenNavigator.Screen name="Home" component={Home}/>
      <HomeScreenNavigator.Screen name="Add Book: Info" component={Home}/>  
      <HomeScreenNavigator.Screen name="Live Translation" component={Home}/>  
      <HomeScreenNavigator.Screen name="Custom Translation" component={Home}/>  
      <HomeScreenNavigator.Screen name="Book Info" component={BookInfo}/>  
      <HomeScreenNavigator.Screen name="Book Reader" component={BookReader}/>  
    </HomeScreenNavigator.Navigator>
  ) 
}

// tab navigator
const TabScreen = createBottomTabNavigator();
function Tab(): JSX.Element {
  const [isAdmin, isUsedAdmin] = useAtom(isAdminAtom);
  return (
    <TabScreen.Navigator screenOptions={{headerShown: false}}>
      <TabScreen.Screen name="Home Screen" component={HomeScreen}/>;
      <TabScreen.Screen name="Library" component={LibraryScreen}/>;
      <TabScreen.Screen name="Settings" component={Settings}/>;
      {isAdmin ? <TabScreen.Screen name="Admin" component={AdminScreen} /> : <></>}
    </TabScreen.Navigator>
  )  
}

// Base app
const NativeStack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <NativeStack.Navigator screenOptions={{headerShown: false}}>
          <NativeStack.Screen name="Splash" component={Splash}/>
          <NativeStack.Screen name="Welcome Screen" component={WelcomeScreen} />
          <NativeStack.Screen name="Tabs" component={Tab}/>
        </NativeStack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;