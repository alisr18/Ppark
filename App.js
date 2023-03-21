

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import Chat from "./pages/chat"
import ChatScreen from "./pages/chatscreen";
import ChatOverviewScreen from "./pages/chat";
import {createStackNavigator} from "@react-navigation/stack";
import Profile from "./pages/profile";
import Account from "./pages/account";
import Cars from "./pages/cars";
import Parking from "./pages/parking";
import Settings from "./pages/settings";
import History from "./pages/history";

import { useColorScheme, View } from "react-native"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Provider, DefaultTheme, Text } from "react-native-paper";

import { createContext, useState, useEffect } from "react";

import themeData from "./theme.json"
import Login from "./pages/login";
import Register from "./pages/register";

const Tab = createMaterialBottomTabNavigator()
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
export const ThemeContext = createContext();
export const SelectedThemeContext = createContext();

function ChatStackNavigator() {
    return (
        <ChatStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatStack.Screen name="ChatOverview" component={ChatOverviewScreen} />
            <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
        </ChatStack.Navigator>
    );
}

function ProfileStackNavigator() {
  return(
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile}/>
      <ProfileStack.Screen name="Account" component={Account}/>
      <ProfileStack.Screen name="Cars" component={Cars}/>
      <ProfileStack.Screen name="Parking" component={Parking}/>
      <ProfileStack.Screen name="Settings" component={Settings}/>
      <ProfileStack.Screen name="History" component={History}/>
    </ProfileStack.Navigator>
  );
}

function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState();

  async function getStoredItem(key, initialValue) {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(JSON.stringify(item)));
      } else {
        setValue(initialValue)
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStoredItem(key, initialValue);
  }, [key, initialValue]);

  const setValue = async (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, valueToStore);
      console.log(`${key}: ${valueToStore}`)
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

function MyTabs({user}) {
  return (
    <Tab.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false}}>
      <Tab.Screen name="Chat" component={ChatStackNavigator}
        options={{
          tabBarIcon: 'chat',
        }}/>
      <Tab.Screen name="Dashboard"
        options={{
          tabBarIcon: 'map',
        }}>
        {(props) => <Dashboard {...props} user={user}/>}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileStackNavigator}
        options={{
          tabBarIcon: 'account',
        }}/>
    </Tab.Navigator>
  )
}

export default function App() {
  const [storedTheme, setStoredTheme] = useAsyncStorage("Application:Theme", "auto")
  const colorScheme = useColorScheme() === "dark"

  const isDarkMode = storedTheme === "auto" ? colorScheme : storedTheme === "dark"

  const selectedData = { storedTheme, setStoredTheme }

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
    colors: themeData.schemes.light
  }
  
  const [user, setUser] = useState(1);
  
  if (!user) {
    return (
      <Provider theme={theme}>
        <ThemeContext.Provider value={theme}>
          <SelectedThemeContext.Provider value={selectedData}>
            <Register setUser={setUser}/>
          </SelectedThemeContext.Provider>
        </ThemeContext.Provider>
      </Provider>
    )
  }
  else if (user == 1) {
    return (
      <Provider theme={theme}>
        <ThemeContext.Provider value={theme}>
          <SelectedThemeContext.Provider value={selectedData}>
            <Login setUser={setUser}/>
          </SelectedThemeContext.Provider>
        </ThemeContext.Provider>
      </Provider>
    )
  }
  else {
    return (
      <Provider theme={theme}>
        <ThemeContext.Provider value={theme}>
          <SelectedThemeContext.Provider value={selectedData}>
            <NavigationContainer theme={theme}>
              <MyTabs user={user}/>
            </NavigationContainer>
          </SelectedThemeContext.Provider>
        </ThemeContext.Provider>
      </Provider>
    )
  }

}