// App.js contains the startup component of the application.

import React, {useState} from 'react';
import { Provider, Text } from "react-native-paper";
import { View } from "react-native";

import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken('pk.eyJ1IjoibWF0aW4xMiIsImEiOiJjbGZibTZxOHMwNGM0M3RreDN0YXN6cjB4In0.LCs5uxPjPMHym58UzqmTWw');
const Dashboard = ({user}) => {
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Mapbox.MapView style={styles.map} />
            </View>
        </View>
    );
}

export default Dashboard;






const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: 300,
        width: 300,
    },
    map: {
        flex: 1
    }
});