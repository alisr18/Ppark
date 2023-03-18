

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

import { Provider, DefaultTheme, Text } from "react-native-paper";

import themeData from "./theme.json"
import { createContext } from "react";

const Tab = createMaterialBottomTabNavigator()
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
export const ThemeContext = createContext();

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

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Chat" component={ChatStackNavigator}
        options={{
          tabBarIcon: 'chat',
        }}/>
      <Tab.Screen name="Dashboard" component={Dashboard}
        options={{
          tabBarIcon: 'map',
        }}/>
      <Tab.Screen name="Profile" component={ProfileStackNavigator}
        options={{
          tabBarIcon: 'account',
        }}/>
    </Tab.Navigator>
  )
}

export default function App() {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

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
  
  return (
    <Provider theme={theme}>
      <ThemeContext.Provider value={theme}>
        <NavigationContainer theme={theme}>
            <MyTabs/>
        </NavigationContainer>
      </ThemeContext.Provider>
    </Provider>
  )
}