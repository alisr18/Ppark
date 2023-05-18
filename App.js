import { NavigationContainer } from "@react-navigation/native"
import ChatScreen from "./pages/chatscreeen";
import {createStackNavigator} from "@react-navigation/stack";
import { getFunctions } from 'firebase/functions';
import Profile from "./pages/profile";
import Account from "./pages/account";
import Cars from "./pages/cars";
import Parking from "./pages/parking";
import Settings from "./pages/settings";
import History from "./pages/history";
import { AuthContext, AuthProvider } from "./authContext";
import Map from "./pages/mapv";
import { StripeProvider } from '@stripe/stripe-react-native';
import { StatusBar, useColorScheme, View } from "react-native"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Provider, DefaultTheme, Text } from "react-native-paper";
import { createContext, useState, useEffect, useContext } from "react";
import { setBackgroundColorAsync } from 'expo-navigation-bar';

import { initStripe } from '@stripe/stripe-react-native';

import themeData from "./theme.json"
import Login from "./pages/login";
import Register from "./pages/register";
import { useAsyncStorage } from "./components/AsyncStorage";
import ChatHome from "./pages/chathome";
import Booking from "./pages/booking";
import MapDashboard from "./pages/mapv";
const Tab = createMaterialBottomTabNavigator()
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
export const ThemeContext = createContext();
export const SelectedThemeContext = createContext();
const MapStack = createStackNavigator();

function ChatStackNavigator({route}) {

    const {user} = route.params;

    return (
        <ChatStack.Navigator screenOptions={{headerShown: false}}>
            <ChatStack.Screen name="ChatHome" component={ChatHome}/>
            <ChatStack.Screen name="chat">
                {props => <ChatScreen {...props} user={user} /> }
            </ChatStack.Screen>
        </ChatStack.Navigator>
    );
}

function ProfileStackNavigator({route}) {

  const {user} = route.params;

  return(
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile}/>
      <ProfileStack.Screen name="Account" component={Account}/>
      <ProfileStack.Screen name="Cars" component={Cars}/>
      <ProfileStack.Screen name="Parking" component={Parking} initialParams={{user: user}}/>
      <ProfileStack.Screen name="Settings" component={Settings}/>
      <ProfileStack.Screen name="History" component={History}/>
    </ProfileStack.Navigator>
  );
}

function MapStackNavigator({route}) {
  const {user} = useContext(AuthContext);
  const user1 = route.params;

  return(
    <MapStack.Navigator screenOptions={{headerShown: false}}>
      <MapStack.Screen name="MapScreen" component={Map}/>
      <MapStack.Screen name="Booking" component={Booking}/>
      <MapStack.Screen name="chat" options={({ route }) => ({ title: route.params.displayname })}>
          {props => <ChatScreen {...props} user={user} user1={user1} /> }
      </MapStack.Screen>
    </MapStack.Navigator>
  );
}

function MyTabs() {

  const {user} = useContext(AuthContext);

  if(!user) {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Login" component={Login}
          options={{
            tabBarIcon: 'login',
          }}/>
        <Tab.Screen name="Register" component={Register}
          options={{
            tabBarIcon: 'account-plus',
          }}/>
      </Tab.Navigator>
    )
  }
  else {
    return (
      <Tab.Navigator initialRouteName="Map" screenOptions={{headerShown: false}}>
        <Tab.Screen name="Chat" component={ChatStackNavigator}
          initialParams={{user: user}}
          options={{
            tabBarIcon: 'chat',
          }}/>
        <Tab.Screen name="Map" component={MapStackNavigator}
          options={{
            tabBarIcon: 'map',
          }}
          initialParams={{user: user}}
        />
        <Tab.Screen name="Profile" component={ProfileStackNavigator}
          options={{
            tabBarIcon: 'account',
          }}
          initialParams={{user: user}}
        />
      </Tab.Navigator>
    )
  }
}

export default function App() {
  const [storedTheme, setStoredTheme] = useAsyncStorage("Application:Theme", "auto")
  const colorScheme = useColorScheme() === "dark"

  const isDarkMode = storedTheme === "auto" ? colorScheme : storedTheme === "dark"

  const selectedData = { storedTheme, setStoredTheme }

  initStripe({publishableKey: "pk_test_51N6fSEKQs9J7J5wlmWIhrGDXxdksDbILSDF5D84QAxgLfb3pEbsz3iCkJCejtPFoYPt7Ylt6BwHn6VvkSsgvJfJZ00XxnAbMcu"})


  useEffect(() => {
    setBackgroundColorAsync(theme.colors.elevation.level2)
  }, [isDarkMode])

  const theme = isDarkMode ? {
    ...DefaultTheme,
    ...themeData,
    custom: 'property',
    dark: true,
    colors: themeData.schemes.dark
    
  } : {
    ...DefaultTheme,
    ...themeData,
    custom: 'property',
    dark: false,
    colors: themeData.schemes.light
  }
  

  return (  
    <AuthProvider>    
      <StripeProvider>
        <Provider theme={theme}>
          <ThemeContext.Provider value={theme}>
            <SelectedThemeContext.Provider value={selectedData}>
              <NavigationContainer theme={theme}>
              <StatusBar
              animated={true}
              backgroundColor={theme.colors.elevation.level2}
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              />
                <MyTabs/>
              </NavigationContainer>
            </SelectedThemeContext.Provider>
          </ThemeContext.Provider>
        </Provider>
      </StripeProvider>
    </AuthProvider>
  );
}