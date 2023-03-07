

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import Login from "./pages/login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"



const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard}/>
      <Tab.Screen name="Login" component={Login}/>
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