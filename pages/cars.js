import { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import { Button, IconButton, TextInput, Avatar } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';

const Cars = () => {

    const navigate = useNavigation();

    const edit = () => {
        console.log("Edit pressed");
    }

    const add = () => {
        console.log("Add pressed");
    }
    
    return (
        <View style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained" 
                iconColor="white"
            />
            
            <View style={styles.carContainer}>
                <Text style={styles.carName}>Volvo XC70</Text>
                <Text style={styles.carStatus}>Active</Text>
                <Text style={styles.carPlate}>NF38293</Text>
                <Button style={styles.carEdit} textColor="#00382F" onPress={edit}>Edit</Button>
            </View>
            
            <View style={styles.otherCars}>
                <Text style={styles.text}>Other Cars:</Text>
                <TouchableOpacity style={styles.listButton}>
                    <Avatar.Icon 
                        size={30}
                        icon="car"
                        style={{backgroundColor: "#191C1B", position: "absolute", left: -170}}
                    />
                    <Text style={styles.listText}>Volkswagen eGolf</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: "#191C1B", position: "absolute", left: 140}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listButton}>
                    <Avatar.Icon 
                        size={30}
                        icon="car"
                        style={{backgroundColor: "#191C1B", position: "absolute", left: -170}}
                    />
                    <Text style={styles.listText}>Ferrari 812 gts</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: "#191C1B", position: "absolute", left: 140}}
                    />
                </TouchableOpacity>
            </View>

            <View style={{position: "absolute", bottom: 25, right: 30}}>
                <IconButton
                    icon="plus"
                    mode="contained"
                    iconColor="#57DBC3"
                    style={styles.addButton}
                    onPress={add}
                />
            </View>
        </View>
    );
}

export default Cars;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#191C1B",
        alignItems: "center",
    },
    close: {
        backgroundColor: "#357266",
        alignSelf: "flex-start",
        marginTop: 25,
    },
    carContainer: {
        alignItems: "center",
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "#3F4946",    
        height: 185,
        width: 318,
        flexDirection: "row",
    },
    carName: {
        fontSize: 32,
        color: "white",
        alignSelf: "flex-start",
        position: "absolute",
        top: 35,
        left: 25,
    },
    carStatus: {
        fontSize: 14,
        color: "#57DBC3",
        alignSelf: "flex-start",
        position: "absolute",
        top: 15,
        right: 35,
    },
    carPlate: {
        fontSize: 20,
        color: "#89938F",
        alignSelf: "flex-start",
        position: "absolute",
        top: 75,
        left: 25,
    },
    carEdit: {
        backgroundColor: "#57DBC3",
        borderRadius: 100,
        alignSelf: "flex-end",
        position: "absolute",
        bottom: 15,
        right: 25,
    },
    otherCars: {
        flexDirection: "column",
        marginTop: 50,
    },
    text: {
        color: "white",
        alignSelf: "flex-start",
        fontSize: 14,
        position: "absolute",
        left: -160,
    },
    listButton: {
        marginTop: 40,
        marginBottom: 15,
        flexDirection: "row",
    },
    listText: {
        color: "white",
        fontSize: 16,
        marginTop: 4,
        position: "absolute",
        left: -120,
    },
    addButton: {
        backgroundColor: "#357266",
        width: 56,
        height: 56,
    },
})