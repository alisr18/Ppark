import { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Button, TextInput, Avatar } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';


const color1 = "#436278";
const color2 = "#357266";
const color3 = "#191C1B";

export default function Profile() {

    const navigation = useNavigation();

    const handlePress = (page) => {
        navigation.navigate(page);
    }

    return (
        <View style={styles.profile}>
            <View style={styles.profileContainer}>
                <Avatar.Icon
                    size={70}
                    icon="account"
                    marginTop={20}
                    style={{backgroundColor: color1}}
                />
                <Text style={styles.profileName}>Navn Navnesen</Text>
            </View>

            <View style={styles.countdownContainer}>
                <View>
                    <Text style={styles.countdownText1}>Time Remaining:</Text>
                    <Text style={styles.countdownText2}>Parked at:</Text>
                    <Text style={styles.countdownText3}>Gate Veinavn 24</Text>   
                </View>
                <View>
                    <Text style={styles.countdownTime}>25:13</Text>
                </View>
            </View>

            <View style={styles.list}>
                <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Account")}>
                    <Avatar.Icon 
                        size={30}
                        icon="account"
                        style={{backgroundColor: color2, marginRight: 15, marginLeft: 38}}
                    />
                    <Text style={styles.listText}>Edit Account</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: color3, marginLeft: 160}}
                    />
                </TouchableOpacity>


                <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Cars")}>
                    <Avatar.Icon 
                        size={30}
                        icon="car"
                        style={{backgroundColor: color2, marginRight: 15, marginLeft: 38}}
                    />
                    <Text style={styles.listText}>Cars</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: color3, marginLeft: 217}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Parking")}>
                    <Avatar.Icon 
                        size={30}
                        icon="parking"
                        style={{backgroundColor: color2, marginRight: 15, marginLeft: 38}}
                    />
                    <Text style={styles.listText}>Parking</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: color3, marginLeft: 197}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Settings")}>
                    <Avatar.Icon 
                        size={30}
                        icon="cog"
                        style={{backgroundColor: color2, marginRight: 15, marginLeft: 38}}
                    />
                    <Text style={styles.listText}>Settings</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: color3, marginLeft: 193}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listButton} onPress={() => handlePress("History")}>
                    <Avatar.Icon 
                        size={30}
                        icon="history"
                        style={{backgroundColor: color2, marginRight: 15, marginLeft: 38}}
                    />
                    <Text style={styles.listText}>History</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{backgroundColor: color3, marginLeft: 200}}
                    />
                </TouchableOpacity>
            </View>
        </View> 
    )
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        backgroundColor: color3,
        alignItems: "center",
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 36,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "#3F4946",    
        height: 185,
        width: 318,
    },
    profileName: {
        fontSize: 34,
        marginTop: 15,
        color: "white",
        alignSelf: "center",
    },
    countdownContainer: {
        alignItems: "center",
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: color2, 
        backgroundColor: color2,
        height: 136,
        width: 318,
        flexDirection: "row",
    },
    countdownText1: {
        fontSize: 18,
        fontWeight: 400,
        color: "white",
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: -25,
    }, 
    countdownText2: {
        fontSize: 13,
        fontWeight: 400,
        color: "white",
        alignSelf: "flex-start",
        marginLeft: 20, 
        marginTop: 5,
    }, 
    countdownText3: {
        fontSize: 13,
        fontWeight: 400,
        color: "white",
        alignSelf: "flex-start",
        position: "absolute",
        top: 27,
        left: 20,
    }, 
    countdownTime: {
        fontSize: 35,
        fontWeight: 400,
        color: "#57DBC3",
        alignSelf: "flex-end",
        position: "absolute",
        left: 45,
        bottom: -20,
    }, 
    list: {
        flexDirection: "column",
        padding: 0,
        alignSelf: "stretch",
        marginTop: 40,
    },
    listButton: {
        marginBottom: 30,
        flexDirection: "row",
    },
    listText: {
        color: "white",
        fontSize: 16,
        marginTop: 4,
    },
})