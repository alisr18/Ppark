

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import Chat from "./pages/chat"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatScreen from "./pages/chat";



const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard}/>
        <Tab.Screen name="Chat" component={ChatScreen}/>
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