import React ,{ useState } from 'react';
import MapView from 'react-native-maps';
import {SafeAreaView, StyleSheet, View,} from 'react-native';
import { Provider } from 'react-redux'
import store from "../../store";
import Mapv from "./mapv";
const Map = () => {

    return (

        <Provider store={store}>
            <Mapv/>
        </Provider>

    );
}

export default Map;





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
