import { Provider, Text } from "react-native-paper";
import React from "react";

const Welcome = ({user}) => {
    return (
        <Provider sx={{marginTop: 50}}>
            <Text>You are logged in.</Text>
            <Text>Welcome, {user.email}!</Text>
        </Provider>
    );
}

export default Welcome;