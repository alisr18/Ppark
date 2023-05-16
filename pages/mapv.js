import React,{useState, useEffect, useContext} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import { GooglePlacesAutocomplete  } from 'react-native-google-places-autocomplete';
import {Image, StyleSheet, View, Alert, TouchableOpacity, TouchableHighlight} from 'react-native';
import { Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {googleapikey} from '@env'
import Icon from 'react-native-vector-icons/Ionicons'; //kansje tar det vek
import * as Location from 'expo-location';
import {useRef} from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, orderBy, query,startAt,endAt, onSnapshot } from 'firebase/firestore';
import {Button, Text, TextInput, Portal, Dialog, IconButton, TouchableRipple} from "react-native-paper";

const Ppark = require("../icons/logo_light.png")
const available = require("../icons/green_marker.png")
const notAvailable=require("../icons/red_marker.png")

//import Geocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import { ThemeContext } from '../App';
import { AuthContext } from '../authContext';

const geofire = require('geofire-common');



const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const map = () => {


    const theme = useContext(ThemeContext);
    const { active } = useContext(AuthContext);
    const [origin, setOrigin] = useState({ latitude: 58.3343, longitude: 8.5781 })
    const [destination, setDestination] = useState({ latitude: null, longitude: null })
    const [SearchRegion, setSearchRegion] = useState(null)
    const mapRef = useRef(null)
    const [parkingData, setParkingData] = useState([]);


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

    const handlePlaceSelection = (data, details) =>{
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


    const handleSearch = async (data, details) => {
        console.log("button has been pressed!")
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                if (SearchRegion) {
                    const parkingData = await searchParkingWithinRadius(SearchRegion);
                    setParkingData(prevState => [...prevState, ...parkingData]);
                    console.log("Parking data", parkingData);
                }
            } catch (error) {
                console.error("Error fetching parking data:", error);
            }
        };
        fetchData();
    }, [SearchRegion]);

    async function searchParkingWithinRadius(searchRegion) {
        if (!searchRegion) return Promise.resolve([]);

        const center = [searchRegion.latitude, searchRegion.longitude];
        const radiusInM = 100000 / 20;

        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];

        for (const b of bounds) {
            const z = collection(db, 'parking');
            const q = query(z, orderBy('geohash', 'asc'),startAt(b[0]),endAt(b[1]));


            await (getDocs(q).then(res => res.docs.map(doc => {
                promises.push(doc.data())
                console.log(doc.data())
            })));

        }
        console.log("promises data: ", promises);

        return promises
    }

    // [END fs_geo_query_hashes]

    return (

        <View style={styles.container}>
            <MapView
                region={SearchRegion}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                customMapStyle={theme.dark ? theme.map.dark : theme.map.light}
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
                    longitudeDelta: 0.01,
                }}
            >
                {SearchRegion?.location && (
                    <Marker
                        coordinate={{
                            latitude: SearchRegion.latitude,
                            longitude: SearchRegion.longitude,
                        }}
                        description="A great city to visit"
                    />
                )}


                {parkingData.map((spots, index) => {
                    if (spots.active) {
                        return (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: spots.latitude,
                                    longitude: spots.longitude,
                                }}
                            >
                                <Image
                                    source={available}
                                    style={styles.marker}
                                    resizeMode='contain'
                                />
                                <Callout tooltip onPress={() => console.log(spots.Address, "pressed")}>
                                    <View style={styles.callout}>
                                        <Text style={styles.text}>{spots.Address}</Text>
                                        <Text style={styles.text}>{spots.Zip} {spots.City}</Text>
                                        <Text style={styles.text}>Book now</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        );
                    }
                    else {
                        return (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: spots.latitude,
                                    longitude: spots.longitude,
                                }}
                            >
                                <Image
                                    source={notAvailable}
                                    style={styles.marker}
                                    resizeMode='contain'
                                />
                                <Callout tooltip onPress={() => alert("Spot is currently unavailable")}>
                                    <View style={styles.callout}>
                                        <Text style={styles.text}>{spots.Address}</Text>
                                        <Text style={styles.text}>{spots.Zip} {spots.City}</Text>
                                        <Text style={styles.text}>Spot is currently unavailable</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        );
                    }
                })}



                {origin?.location && (
                    <Marker
                        resizeMode="contain"
                        coordinate={{
                            latitude: origin.latitude,
                            longitude: origin.longitude,
                        }}
                        identifier={'origin'}
                    />
                )}
                {destination?.location && (
                    <Marker
                        resizeMode="contain"
                        coordinate={{
                            latitude: destination.latitude,
                            longitude: destination.longitude,
                        }}
                        identifier={'destination'}
                    />
                )}
                {origin &&
                    destination && (
                        <MapViewDirections
                            apikey={googleapikey}
                            origin={{
                                latitude: origin.latitude,
                                longitude: origin.longitude,
                            }}
                            destination={{
                                latitude: destination.latitude,
                                longitude: destination.longitude,
                            }}
                            strokeColor={'black'}
                            strokeWidth={2}
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(
                                    `Started routing between "${params.origin}" and "${params.destination}"`
                                );
                            }}
                        />
                    )}
            </MapView>
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Where to park?"
                    styles={{
                        textInput: styles.textInput,
                        listView: styles.listView,
                    }}
                    renderRightButton={() => (
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Icon name="search-outline" size={24} color="#333" />
                        </TouchableOpacity>
                    )}
                    fetchDetails={true}
                    onPress={handlePlaceSelection}
                    query={{
                        key: googleapikey,
                        language: 'en',
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




export default map;

const styles = StyleSheet.create({
    container: {
        flex:1
    },


    map: {
        width: '100%',
        height: '100%',
    },

    callout: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: 150,
    },
    text: {
        color: 'white',
        marginVertical: 4,
        marginHorizontal: 10,
        alignContent: 'center',
    },
    marker: {
        width: 35,
        height: 35, 
    },


    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 4,
        overflow: "hidden",
        backgroundColor: "#fff",
        borderRadius: 20,
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