import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { TextInput } from "react-native-paper"
import { ThemeContext } from '../App';
import { useEffect } from 'react';
import { useContext } from 'react';

function Mapv() {
    const theme = useContext(ThemeContext)
    return (
        <View style={styles.container}>
            <MapView 
            loadingEnabled={true} 
            style={styles.map} 
            customMapStyle={theme.dark ? theme.map.dark : theme.map.light}
            />
            <View style={{ position: 'absolute', top: 10, width: '100%' }}>
                <TextInput
                mode='outlined'
                    placeholder={'Search'}
                />
            </View>
        </View>
    );
}

export default Mapv;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    searchbar:{
        borderRadius: 10,
        margin: 10,
        color: '#000',
        borderColor: '#666',
        backgroundColor: '#FFF',
        borderWidth: 1,
        height: 45,
        paddingHorizontal: 10,
        fontSize: 18,
    }
});

