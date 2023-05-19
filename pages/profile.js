import {useContext, useEffect, useState} from "react";
import {View, StyleSheet, Image, TouchableOpacity, ScrollView} from "react-native";
import { Button, TextInput, Text, Avatar, Card, Surface, List, Dialog } from "react-native-paper";
import {useIsFocused, useNavigation } from '@react-navigation/native';
import {ThemeContext, UserContext} from "../App";
import {auth, db} from "../firebaseConfig";
import {collection, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import { Modal, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL, getStorage} from "firebase/storage";
import { AuthContext } from "../authContext";

const color1 = "#436278";
const color2 = "#357266";

export default function Profile() {

    const { user, userData, getUserData } = useContext(AuthContext);

    const isFocused = useIsFocused()

    const theme = useContext(ThemeContext)

    const color3 = theme.colors.background;

    const navigation = useNavigation();

    const [currentOrder, setCurrentOrder] = useState()

    const [timerCount, setTimer] = useState()

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                if (lastTimerCount == 0) {
                    //your redirection to Quit screen
                } else {
                    lastTimerCount <= 1 && clearInterval(interval)
                    return lastTimerCount - 1
                }
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        console.log()
        if (currentOrder?.endDate){
            const secondsRemaining = ~~((currentOrder.endDate.toDate() - new Date())/1000)
            if (secondsRemaining > 0) setTimer(secondsRemaining)
        }
    }, [currentOrder])

    const handlePress = (page) => {
        navigation.navigate(page);
    }

    function MenuArrow() {
        return (
            <List.Icon
                icon="menu-right"
                style={{backgroundColor: color3}}
            />
        )
    }

    useEffect(() => {
        if(user && isFocused) {
            getUserData()
            getParkingOrder()
        }
    }, [user, isFocused])

    const [isModalVisible, setIsModalVisible] = useState(false);

    let balanceValue = userData?.balance ? userData.balance.toFixed(2).toString() : '0';

    const getParkingOrder = async () => {
        const orderRef = collection(db, "orders")
        if(orderRef) {
            const docQuery = query(orderRef, where("renter", "==", user.uid), where("endDate", ">", new Date()))
            const order = await getDocs(docQuery).catch(e => console.log(e))
            const orderData = order.docs.map(v => v.data())
            if(orderData.length) {
                setCurrentOrder(orderData[0])
            } else setCurrentOrder(undefined)
        }
    }

    useEffect(() => {
    }, []);


    // Function to open image picker and upload the selected image
    const pickAndUploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const storage = getStorage(); // Get a reference to the storage service
            const imageRef = ref(storage, 'images/' + result.uri.split('/').pop()); // Create a reference to the image file in Firebase Storage
            const response = await fetch(result.uri); // Fetch the image data from the device
            const blob = await response.blob(); // Convert the image data to a Blob

            // Upload the image to Firebase Storage
            const snapshot = await uploadBytes(imageRef, blob);
            console.log('Image uploaded to Firebase Storage:', snapshot.totalBytes, 'bytes');

            // Get the download URL for the image
            const downloadURL = await getDownloadURL(imageRef);
            console.log('Download URL:', downloadURL);

            // Save the download URL to Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                profilePicture: downloadURL
            });
            console.log('Download URL saved to Firestore');
            getUserData()
            closeModal()
            alert("Profile picture updated")

        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    let hour = ~~(timerCount / 3600)
    let minutes = ~~((timerCount % 3600) / 60)
    let seconds = (timerCount % 60)

    return (
        <ScrollView>
        <View style={{ padding: 30 }}>
            <View style={styles.profile}>
                <Surface
                    style={{
                        ...styles.profileContainer,
                        borderColor: theme.colors.surfaceDisabled,
                    }}
                    elevation={0}
                >

                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        {userData?.profilePicture ? (
                            <Avatar.Image
                                source={{ uri: userData.profilePicture }}
                                size={70}
                                marginTop={20}
                                style={{ backgroundColor: theme.colors.tertiaryContainer }}
                            />
                        ) : (
                            <Avatar.Icon
                                size={70}
                                icon="account"
                                marginTop={20}
                                style={{ backgroundColor: theme.colors.tertiaryContainer }}
                            />
                        )}
                        <Avatar.Icon
                            size={24}
                            icon="pencil"
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundColor: theme.colors.primary,
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.profileName}>
                        {userData?.firstName ?? ""} {userData?.lastName ?? ""} 
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar.Icon
                            size={24}
                            icon="cash" // replace with the icon you want to use for balance
                            style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                marginRight: 5,  // adds space to the right of the icon
                            }}
                        />
                        <Text style={styles.balanceText}>
                                     {balanceValue} NOK
                        </Text>
                    </View>
                </Surface>

                <Surface style={styles.countdownContainer} elevation={3}>
                    {
                        currentOrder && timerCount ? (
                            <>
                                <View style={{maxWidth: "46%"}}>
                                    <Text numberOfLines={1} style={styles.countdownText1}>Time Left:</Text>
                                    <Text
                                        style={{
                                            ...styles.countdownText2,
                                            color: theme.colors.onSurfaceDisabled,
                                        }}
                                    >
                                        Parked at:
                                    </Text>
                                    <Text
                                    numberOfLines={2}
                                        style={{
                                            ...styles.countdownText3,
                                            color: theme.colors.onSurface,
                                        }}
                                    >
                                        {currentOrder.address}
                                    </Text>
                                </View>
                                <View style={{ justifyContent: "center", maxWidth: "54%" }}>
                                    <Text
                                    numberOfLines={2}
                                        style={{
                                            ...styles.countdownTime,
                                            color: theme.colors.primary,
                                        }}
                                    >
                                        {
                                            hour <= 24 ? 
                                            `${hour > 0 ? hour + ":" : ""}${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`
                                            : `${~~(hour / 24)} days`
                                        }
                                        
                                    </Text>
                                </View>
                            </>
                            ) : (
                                <View style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                                    <Button mode="contained-tonal" onPress={() => navigation.navigate("Map")}>
                                        Find Parking
                                    </Button>
                                </View>
                            )
                    }
                </Surface>
            </View>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Account")}>
                <List.Item
                    left={(props) => <List.Icon
                        {...props}
                        icon="account"
                        color={theme.colors.primary}
                    />}
                    right={() =>
                        <MenuArrow/>}
                    title="Edit Account"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Cars")}>
                <List.Item
                    left={(props) => <List.Icon
                        icon="car"
                        {...props}
                    />}
                    right={(props) => <MenuArrow {...props}/>}
                    title="Cars"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Parking")}>
                <List.Item
                    left={(props) => <List.Icon
                        icon="parking"
                        {...props}
                    />}
                    right={(props) =>
                        <List.Icon
                            icon="menu-right"
                            style={{backgroundColor: color3}}
                            {...props}
                        />}
                    title="Parking"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Settings")}>
                <List.Item
                    left={(props) => <List.Icon
                        icon="cog"
                        {...props}
                    />}
                    right={() => <MenuArrow/>}
                    title="Settings"
                />
            </TouchableOpacity>
        </View>

    <Dialog
        //animationType="slide"
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(prev => !prev)}
    >
        <Dialog.Title>Change Profile Picture</Dialog.Title>
            <Dialog.Content style={{display: "flex", alignItems: "center"}}>
                {userData?.profilePicture && (
                    <Image
                        source={{ uri: userData.profilePicture }}
                        style={{ width: 200, height: 200 }}
                    />
                )}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={closeModal}>
                    Close
                </Button>
                <Button mode="contained" onPress={pickAndUploadImage}>
                    Choose Image
                </Button>
            </Dialog.Actions>
    </Dialog>
</ScrollView>
    )
}

const styles = StyleSheet.create({
    profile: {
        alignItems: "center",
    },
    profileContainer: {
        alignItems: "center",
        alignContent: "center",
        alignSelf: "stretch",
        borderWidth: 2,
        borderRadius: 12,
        height: 185,
    },
    profileName: {
        fontSize: 34,
        marginTop: 10,
        alignSelf: "center",
    },
    countdownContainer: {
        display: "flex",
        flex: 2,
        justifyContent: "space-between",
        marginTop: 20,
        height: 150,
        borderRadius: 12,
        padding: 25,
        marginBottom: 20,
        flexDirection: "row",
        alignSelf: "stretch",
    },
    countdownText1: {
        fontSize: 22,
        fontWeight: 400,
        marginBottom: 5,
    },
    countdownText2: {
        fontSize: 13,
        fontWeight: 400,
    },
    countdownText3: {
        fontSize: 16,
        fontWeight: 400,
    },
    countdownTime: {
        fontSize: 36,
        fontWeight: 400,
    },
    listButton: {
    },
    listText: {
        fontSize: 16,
        marginTop: 4,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

})