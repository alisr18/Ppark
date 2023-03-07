

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"



const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
        <MyTabs/>
    </NavigationContainer>
  )
}