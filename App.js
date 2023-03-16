

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import { useColorScheme } from "react-native"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Provider, MD3DarkTheme, MD3LightTheme, Text } from "react-native-paper";

import themeData from "./theme.json"

const Tab = createMaterialBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: 'map',
        }}/>
    </Tab.Navigator>
  )
}

export default function App() {
  const colorScheme = useColorScheme()
  const isDarkMode = true // colorScheme === "dark"

  const theme = isDarkMode ? {
    ...MD3DarkTheme,
    ...themeData,
    colors: {
      ...MD3DarkTheme.colors,
      ...themeData.schemes.dark
    },
    
  } : {
    ...MD3LightTheme,
    ...themeData,
    colors: {
      ...MD3LightTheme.colors,
      ...themeData.schemes.light
    },
  }
  
  return (
    <Provider theme={theme}>
      <NavigationContainer theme={theme}>
        <MyTabs/>
    </NavigationContainer>
    </Provider>
  )
}