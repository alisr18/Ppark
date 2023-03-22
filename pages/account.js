import React, { useState } from "react";
import {View, StyleSheet, TouchableOpacity, Alert} from "react-native";
import { Button, TextInput, Text, IconButton, Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {doc, setDoc, updateDoc} from "firebase/firestore";
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

    const navigate = useNavigation();

    const handleSave = async () => {
        const user = auth.currentUser;
        const userId = user.uid;
        if (firstName !== "" && lastName !== "" && country !== "" && address !== "" && zipcode !== "" && city !== "") {
            await updateDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                country,
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
            <TextInput
                style={styles.input}
                label="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
                style={styles.input}
                label="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
            />
            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                style={{ width: "50%" }}
                anchor={
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <TextInput
                            style={styles.input}
                            label="Country"
                            value={country}
                            onChangeText={(text) => setCountry(text)}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>
                }
            >
                {countriesList.map((countryName, index) => (
                    <Menu.Item key={index} onPress={() => handleCountrySelect(countryName)} title={countryName} />
                ))}
            </Menu>

            <TextInput
                style={styles.input}
                label="Address"
                value={address}
                onChangeText={(text) => setAddress(text)}
            />
            <TextInput
                style={styles.input}
                label="Zipcode"
                value={zipcode}
                onChangeText={(text) => setZipcode(text)}
            />
            <TextInput
                style={styles.input}
                label="City"
                value={city}
                onChangeText={(text) => setCity(text)}
            />
            <Button style={styles.saveButton} mode="contained" onPress={handleSave}>
                Save
            </Button>
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
    },
});
