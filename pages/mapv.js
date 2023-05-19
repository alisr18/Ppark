import React,{ useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { GooglePlacesAutocomplete  } from 'react-native-google-places-autocomplete';
import { Image, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { googleapikey } from '@env'
import * as Location from 'expo-location';
import { useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, orderBy, query,startAt,endAt } from 'firebase/firestore';
import { Text, FAB, List, useTheme } from "react-native-paper";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const available = require("../icons/green_marker.png")
const notAvailable=require("../icons/red_marker.png")
let zoomThreshold = 0.05;


const geofire = require('geofire-common');


const Map = () => {

    const theme = useTheme();
    const styles = styleSheet(theme)
    const mapRef = useRef(null)
    const [parkingData, setParkingData] = useState([]);

    const [SearchRegion, setSearchRegion] = useState({latitude: 58.3343, longitude: 8.5781, latitudeDelta: 0.1, longitudeDelta: 0.1});
    const [prevRegion, setPrevRegion] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.1, longitudeDelta: 0.1});
    const [prevZoom, setPrevZoom] = useState(null);

    const navigation = useNavigation();


    useEffect(() => {
        getCurrentLocationPermission()
    }, [])

    async function getCurrentLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            alert('Permission to access location was denied')
            return
        }
        else {
            let location = await Location.getCurrentPositionAsync({})
            setSearchRegion({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });

            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
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
                    setParkingData(parkingData); 
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

        let radiusInM; // Radius for markers (m)

        if (searchRegion.latitudeDelta && searchRegion.longitudeDelta) {
            radiusInM = Math.max(searchRegion.latitudeDelta, searchRegion.longitudeDelta) * 10000; 
            if (radiusInM > 15000) {
                radiusInM = 15000;
            } 
            else if (radiusInM < 2000) {
                radiusInM = 2000;
            }
        }
        else {
            radiusInM = 2000;
        }
        
        console.log("Search radius in meter:", radiusInM);

        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];

        for (const b of bounds) {
            const z = collection(db, 'parking_session');
            const q = query(z, orderBy('geohash', 'asc'),startAt(b[0]),endAt(b[1]));


            await (getDocs(q).then(res => res.docs.map(doc => {
                promises.push({...doc.data(), id: doc.id})
            })));

        }
        console.log("promises data: ", promises);

        return promises
    }

    // [END fs_geo_query_hashes]

    const handleBooking = (spot) => {
        navigation.navigate('Booking', { spot: spot });
    }

    useFocusEffect(
        React.useCallback(() => {
            if (prevRegion.latitude != 0) {
                setSearchRegion(prevRegion);
            }  
        }, [])
    );

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    function getDistanceMoved(lat1, lon1, lat2, lon2) {
        
        var earthRadius = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = earthRadius * c;
        return d;
    }

    return (

        <View style={styles.container}>
            <MapView
                region={{
                    latitude: SearchRegion.latitude,
                    longitude: SearchRegion.longitude,
                    latitudeDelta: SearchRegion.latitudeDelta,
                    longitudeDelta: SearchRegion.longitudeDelta,
                }}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                customMapStyle={theme.dark ? theme.map.dark : theme.map.light}
                showsUserLocation={true}
                showsMyLocationButton={false}
                userLocationUpdateInterval={2000}
                followsUserLocation={false}
                showsTraffic={true}
                style={styles.map}
                initialRegion={{
                    latitude: SearchRegion.latitude,
                    longitude: SearchRegion.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onRegionChangeComplete={region => {
                    
                    const distance = prevRegion ? getDistanceMoved (
                        prevRegion.latitude,
                        prevRegion.longitude,
                        region.latitude,
                        region.longitude
                    ) : null;
                    
                    const zoomLevel = Math.max(region.latitudeDelta, region.longitudeDelta);
                    
                    const threshold = zoomLevel * 12; // Oppdaterer når brukeren flytter denne avstanden (km)
                    
                    const zoomChange = Math.abs((prevZoom || 0) - region.latitudeDelta);
                                      
                    if ((region.latitudeDelta * 5) < 10 && zoomThreshold == 10) {
                        zoomThreshold = region.latitudeDelta * 5;
                    }

                    if (!prevRegion || distance >= threshold || (zoomChange >= zoomThreshold && zoomThreshold < 10)) {
                        console.log("Moved >", threshold, "or Zoomchange >", zoomThreshold);
                        setSearchRegion(region);
                        setPrevRegion(region);
                        
                        zoomThreshold = region.latitudeDelta * 5;
                        if (zoomThreshold > 10) {
                            zoomThreshold = 10;
                        }
                        setPrevZoom(region.latitudeDelta);
                    }
                }}
            >
                
                {parkingData.map((spots, index) => {
                    if (spots.active && (!spots.unavailable || new Date(spots.unavailable.toDate()) <= new Date())) {
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
                                <Callout tooltip onPress={() => handleBooking(spots)}>
                                    <View style={styles.callout}>
                                        <Text style={styles.text}>{spots.Address}</Text>
                                        <Text style={styles.text}>{spots.price} NOK/h</Text>
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
            </MapView>
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Where to park?"
                    textInputProps={{
                        placeholderTextColor: theme.colors.onSurfaceDisabled
                    }}
                    styles={{
                        textInput: styles.textInput,
                        listView: styles.listView,
                        textInputContainer: styles.textInputContainer,
                        row: styles.row,
                        
                        description: {
                            color: theme.colors.onSurface,
                        },
                        separator: {
                            height: 1,
                            backgroundColor: theme.colors.onSurfaceDisabled,
                        },
                    }}
                    renderRightButton={() => (
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <List.Icon color={theme.colors.onSurface} size={24} icon="magnify"/>
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
                <FAB icon="crosshairs-gps" onPress={() => getCurrentLocationPermission()}/>
            </View>
        </View>

    )
}



export default Map;

const styleSheet = (theme) => StyleSheet.create({
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
        top: 5,
        left: 0,
        right: 0,
        margin: 4,
        overflow: "hidden",
        display: "flex",
        backgroundColor: theme.colors.elevation.level5,
        borderRadius: 20,
    },
    textInputContainer: {
        borderRadius: 5,
        borderWidth: 0,
        height: 50,
        marginTop: 5
    },
    textInput: {
        color: theme.colors.onSurface,
        backgroundColor: theme.colors.elevation.level5,
    },
    listView: {
        backgroundColor: theme.colors.surface,
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
    },
    row: {
        color: theme.colors.onSurface,
        backgroundColor: theme.colors.elevation.level5
    },
});