// App.js contains the startup component of the application.

import React, {useState} from 'react';
import { Provider, Text } from "react-native-paper";
import { View } from "react-native";


const Dashboard = ({user}) => {
    return (
        <View style={{alignItems: "center", flex: 1, marginTop: 50}}>
            <Text>You are logged in.</Text>
            <Text>Welcome, {user.email}!</Text>
        </View>   
    );
}

export default Dashboard;