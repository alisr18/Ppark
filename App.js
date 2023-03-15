

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import Chat from "./pages/chat"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatScreen from "./pages/chatscreen";
import ChatOverviewScreen from "./pages/chat";
import {createStackNavigator} from "@react-navigation/stack";




const Tab = createBottomTabNavigator()
const ChatStack = createStackNavigator();

function ChatStackNavigator() {
    return (
        <ChatStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatStack.Screen name="ChatOverview" component={ChatOverviewScreen} />
            <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
        </ChatStack.Navigator>
    );
}



function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard}/>
        <Tab.Screen name="Chat" component={ChatStackNavigator}/>
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