import React, {useEffect, useState} from "react";
import {View, StyleSheet, TouchableOpacity, Alert, Modal} from "react-native";
import { Button, TextInput, Text, IconButton, Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {doc,getDoc,setDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";



const countriesList = [
    "Norway",
    "Sweden",
    "Denmark",
    // Add more countries here
];

const Account = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const navigate = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            const userDoc = doc(db, 'users', user.uid);
            const userData = (await getDoc(userDoc)).data();

            if (userData) {
                setFirstName(userData.firstName || '');
                setLastName(userData.lastName || '');
                setAddress(userData.address || '');
                setZipcode(userData.zipcode || '');
                setCity(userData.city || '');
            }
        };

        fetchUserData();
    }, []);

    const handleDeleteAccount = () => {
        // Perform account deletion logic here
        Alert.alert("Account deleted.");
        setModalVisible(false);
    };
    const handleSave = async () => {
        const user = auth.currentUser;
        const userId = user.uid;
        if (firstName !== "" && lastName !== "" && address !== "" && zipcode !== "" && city !== "") {
            await updateDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                address,
                zipcode,
                city,
            });
            Alert.alert("Profile updated.");
        } else {
            Alert.alert("All fields are required.");
        }
    };
    const handleCountrySelect = (selectedCountry) => {
        setCountry(selectedCountry);
        setMenuVisible(false);
    };

    return (
        <View style={styles.page}>
            <IconButton
                style={styles.close}
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal"
            />
            <Text style={styles.text}>Account</Text>
            <View style={styles.nameInputContainer}>
                <TextInput
                    style={[styles.input, styles.inputFirstName]}
                    label="First Name"
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                />
                <TextInput
                    style={[styles.input, styles.inputLastName]}
                    label="Last Name"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                />
            </View>

            <TextInput
                style={styles.input}
                label="Address"
                value={address}
                onChangeText={(text) => setAddress(text)}
            />



            <View style={styles.nameInputContainer}>
                <TextInput
                    style={styles.inputFirstName}
                    label="Zipcode"
                    value={zipcode}
                    onChangeText={(text) => setZipcode(text)}
                />
                <TextInput
                    style={styles.inputFirstName}
                    label="City"
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
            </View>
            <Button style={styles.saveButton} mode="contained" onPress={handleSave}>
                Save
            </Button>
            <Button
                style={styles.deleteButton}
                mode="contained"
                onPress={() => setModalVisible(true)}
            >
                Delete Account
            </Button>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTextBlack}>
                            Are you sure you want to delete your account?{'\n'}This is a permanent action.
                        </Text>

                        <View style={styles.modalButtons}>
                            <Button    style={styles.yesButton} mode="contained" onPress={handleDeleteAccount}>
                                Yes
                            </Button>
                            <Button    style={styles.noButton} mode="outlined" onPress={() => setModalVisible(false)}>
                                No
                            </Button>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Account;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: "center",
    },
    close: {
        alignSelf: "flex-start",
        marginTop: 25,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        marginBottom: 10,
    },
    saveButton: {
        marginTop: 20,
        width: "38%",
    },
    inputHalf: {
        width: "80%",
    },
    nameInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    inputFirstName: {
        width: "48%",
    },
    inputLastName: {
        width: "48%",
    },
    inputCountry: {
        width: "80%", // Change the width value as desired
    },
    // ...
    deleteButton: {
        marginTop: 20,
        backgroundColor: "red",
        width: "38%",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "80%",
    },
    yesButton: {
        flex: 1,
        marginRight: 5,
    },
    noButton: {
        flex: 1,
        marginLeft: 5,
    },
    modalTextBlack: {
        color: 'red',
        marginBottom: 15,


    }
});