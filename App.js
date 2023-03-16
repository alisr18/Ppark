

import { NavigationContainer } from "@react-navigation/native"
import Dashboard from "./pages/dashboard"
import Chat from "./pages/chat"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatScreen from "./pages/chatscreen";
import ChatOverviewScreen from "./pages/chat";
import {createStackNavigator} from "@react-navigation/stack";
import Profile from "./pages/profile";
import Account from "./pages/account";
import Cars from "./pages/cars";
import Parking from "./pages/parking";
import Settings from "./pages/settings";
import History from "./pages/history";




const Tab = createBottomTabNavigator()
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();

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
      <Tab.Screen name="Chat" component={ChatStackNavigator}/>
      <Tab.Screen name="Dashboard" component={Dashboard}/>
      <Tab.Screen name="Profile" component={ProfileStackNavigator}/>
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