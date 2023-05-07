
import React,{useState, useEffect} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Image, StyleSheet, View} from 'react-native';
import { Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {googleapikey} from '@env'

import * as Location from 'expo-location';
import {useRef} from "react";

const Ppark = require("../../icons/logo_light.png")



const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapv = () => {



    const theme = useContext(ThemeContext);
    const { active } = useContext(AuthContext);



    const [origin, setOrigin] = useState({ latitude: 58.3343, longitude: 8.5781 })
    const [destination, setDestination] = useState({ latitude: null, longitude: null })
    const mapRef = useRef(null)

    useEffect(() => {
        getCurrentLocationPermission()
    }, [])

    useEffect(() => {
        if (origin !=null || destination!=null) return
        mapRef?.current?.fitToCoordinates(['origin', 'destination'], {
            edgePadding: {
                right: 50,
                bottom: 50,
                left: 50,
                top: 50}
        })
    }, [origin, destination])

    async function getCurrentLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            alert('Permission to access location was denied')
            return
        }
        let location = await Location.getCurrentPositionAsync({})
        setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    }
    function handleDestinationSelect(data, details) {
        const destinationLocation = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
        }
        setDestination(destinationLocation)
        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
            edgePadding: { top: 50, right: 50, left:50, bottom: 50}
        })
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
              //  customMapStyle={{
                //    myLocationButtonPosition: 'bottomRight',

               // }}
                customMapStyle={theme.dark ? theme.map.dark : theme.map.light}

                showsUserLocation={true}
                showsMyLocationButton={true}
                userLocationUpdateInterval={2000}
                followsUserLocation={true}
                showsTraffic={true}
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                }}
            >
                {origin?.location && (
                    <MapView.Marker
                        resizeMode="contain"
                        coordinate={{ latitude: origin.latitude, longitude: origin.longitude }}
                        identifier={'origin'}
                    />
                )}
                {destination?.location && (
                    <MapView.Marker
                        resizeMode="contain"
                        coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
                        identifier={'destination'}
                    />
                )}

                {origin && destination && (
                    <MapViewDirections
                        apikey={googleapikey}
                        origin={{ latitude: origin.latitude, longitude: origin.longitude }}
                        destination={{ latitude: destination.latitude, longitude: destination.longitude }}
                        strokeColor={'black'}
                        strokeWidth={1}
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                    />
                )}
            </MapView>

            <View style={{ position: 'absolute', width: '80%' }}>
                <GooglePlacesAutocomplete
                    placeholder="Where to park?"
                    styles={styles.searchbar}
                    fetchDetails={true}
                    onPress={handleDestinationSelect}
                    query={{
                        key: googleapikey,
                        language: 'en'
                    }}
                />
            </View>
        </View>
    )
}

export default mapv;





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
