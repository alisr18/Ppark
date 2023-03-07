import {Text, View} from "react-native";
import React from "react";

const Welcome = ({user}) => {
    return (
        <View style={{marginTop: 50}}>
            <Text>You are logged in.</Text>
            <Text>Welcome, {user.email}!</Text>
        </View>
    );
}

export default Welcome;