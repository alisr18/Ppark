

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import { useColorScheme } from "react-native"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Provider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";

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
  const isDarkMode = colorScheme === "dark"

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme
  return (
    <Provider theme={theme}>
      <NavigationContainer theme={theme}>
        <MyTabs/>
    </NavigationContainer>
    </Provider>
  )
}