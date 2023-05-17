import {useContext, useEffect, useState} from "react";
import {scrollview, View, StyleSheet, Image, TouchableOpacity, ScrollView} from "react-native";
import { Button, TextInput, Text, Avatar, Card, Surface, List, Dialog } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';
import {ThemeContext, UserContext} from "../App";
import {auth, db} from "../firebaseConfig";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { Modal, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes, getDownloadURL, getStorage} from "firebase/storage";
import { AuthContext } from "../authContext";

const color1 = "#436278";
const color2 = "#357266";

export default function Profile() {

    const { user, userData, logout } = useContext(AuthContext);


    const theme = useContext(ThemeContext)

    const color3 = theme.colors.background;

    const navigation = useNavigation();

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


    const [profilePictureURL, setProfilePictureURL] = useState("");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    let balanceValue = userData?.balance ? userData.balance.toString() : '';

    const signOut = async () => {
        try {
            logout();
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);




    // Function to open image picker and upload the selected image
    const pickAndUploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
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
            closeModal()
            alert("Profile picture updated")

        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };
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
                    <View>
                        <Text style={styles.countdownText1}>Time Remaining:</Text>
                        <Text
                            style={{
                                ...styles.countdownText2,
                                color: theme.colors.onSurfaceDisabled,
                            }}
                        >
                            Parked at:
                        </Text>
                        <Text
                            style={{
                                ...styles.countdownText3,
                                color: theme.colors.onSurface,
                            }}
                        >
                            Gate Veinavn 24
                        </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                        <Text
                            style={{
                                ...styles.countdownTime,
                                color: theme.colors.primary,
                            }}
                        >
                            25:13
                        </Text>
                    </View>
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

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("History")}>
                <List.Item
                    left={(props) => <List.Icon
                        icon="history"
                        {...props}
                    />}
                    right={() => <MenuArrow/>}
                    title="History"
                />
            </TouchableOpacity>

    <TouchableOpacity style={styles.listButton} onPress={signOut}>
        <List.Item
            left={(props) => <List.Icon
                icon="logout"
                {...props}
            />}
            right={() => <MenuArrow/>}
            title="Sign out"
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
    modalView: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 30,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
})