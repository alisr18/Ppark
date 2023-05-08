

import React,{useState, useEffect, useContext} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Image, StyleSheet, View, Alert, TouchableOpacity} from 'react-native';
import { Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {googleapikey} from '@env'
import Icon from 'react-native-vector-icons/Ionicons'; //kansje tar det vek

import * as Location from 'expo-location';
import {useRef} from "react";

const Ppark = require("../icons/logo_light.png")

//import Geocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import { ThemeContext } from '../App';
import { AuthContext } from '../authContext';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapv = () => {



    const theme = useContext(ThemeContext);
    const { active } = useContext(AuthContext);



    const [origin, setOrigin] = useState({ latitude: 58.3343, longitude: 8.5781 })
    const [destination, setDestination] = useState({ latitude: null, longitude: null })
    const [SearchRegion, setSearchRegion] = useState(null)



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
                top: 50
            }
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



        mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
           }
    function handleDestinationSelect(data,details) {
        const destinationLocation = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
        }
        setDestination(destinationLocation)
        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
            edgePadding: { top: 50, right: 50, left:50, bottom: 50}
        })
    }

    const handleSerachRegion = (data, details) =>{
        const region= {
            longitude: details.geometry.location.lng,
            latitude: details.geometry.location.lat,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05

        }
        try {
            setSearchRegion(region);

            console.log("pregion lat:",region.latitude);
            console.log("pregion lng:",region.longitude);
            console.log("details; ",details.geometry.location.lng,)

            mapRef.current.animateToRegion(SearchRegion);
        }catch (error)
        {
            Alert.alert("Error","Failed to fetch data. Please try again")
        }

    }

    const handleSearch = ()=>
    {
        console.log("search button has been pressd. ")
    }






    return (
        <View style={styles.container}>
            <MapView
                region={SearchRegion}
                ref={mapRef}

                provider={PROVIDER_GOOGLE}
                customMapStyle={
                    {theme: theme.dark ? theme.map.dark : theme.map.light}
                }

                showsUserLocation={true}
                showsMyLocationButton={false}
                userLocationUpdateInterval={2000}
                followsUserLocation={true}
                showsTraffic={true}
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
            >
                {SearchRegion?.location && (
                    <Marker coordinate={{latitude: SearchRegion.latitude, longtiude :SearchRegion.longitude}}
                            description="A great city to visit"

                    />)}


                {origin?.location && (
                    <Marker
                        resizeMode="contain"
                        coordinate={{ latitude: origin.latitude, longitude: origin.longitude }}
                        identifier={'origin'}
                    />
                )}
                {destination?.location && (
                    <Marker
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
                        strokeWidth={2}
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                    />
                )}
            </MapView>

            <View style={styles.searchContainer} >
                <GooglePlacesAutocomplete
                    placeholder="Where to park?"
                    styles={{
                        textInputContainer: styles.textInputContainer,
                        textInput: styles.textInput,
                        listView: styles.listView,
                    }}

                    renderRightButton={() => (
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Icon name='search-outline' size={24} color='#333' />
                        </TouchableOpacity>  )}

                    fetchDetails={true}
                    onPress={handleSerachRegion}
                    query={{
                        key: googleapikey,
                        language: 'en'
                    }}
                />
            </View>
            <View style={styles.currentLocationButton}>
                <TouchableOpacity onPress={getCurrentLocationPermission}>
                    <Icon name="my-location" size={28} color="#333" />
                </TouchableOpacity>
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


    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 4,
        overflow: "hidden",
        backgroundColor: "#fff",
        borderRadius: 30
    },
    textInputContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        borderWidth: 0,
        height: 50,
        marginTop: 5
    },
    listView: {
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        borderWidth: 0,
        marginTop:10,
    },
    searchButton: {
        marginRight: 10,
        marginTop:10
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

});