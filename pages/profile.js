import { useContext, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, Text, Avatar, Card, Surface, List } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';
import { ThemeContext } from "../App";


const color1 = "#436278";
const color2 = "#357266";

export default function Profile() {

    const theme = useContext(ThemeContext)

    const color3 = theme.colors.background;

    const navigation = useNavigation();

    const handlePress = (page) => {
        navigation.navigate(page);
    }

    function MenuArrow() {
        return (
            <Avatar.Icon 
                size={30}
                icon="menu-right"
                style={{backgroundColor: color3}}
            />
        )
    }

    return (
        <View style={{paddingHorizontal: 30}}>
            <View style={styles.profile}>
                <Surface style={{...styles.profileContainer, borderColor: theme.colors.onSurfaceDisabled}} elevation={0}>
                        <Avatar.Icon
                            size={70}
                            icon="account"
                            marginTop={20}
                            style={{backgroundColor: theme.colors.tertiaryContainer}}
                        />
                        <Text style={styles.profileName}>Navn Navnesen</Text>
                </Surface>

                <Surface style={styles.countdownContainer} elevation={3}>
                    <View>
                        <Text style={styles.countdownText1}>Time Remaining:</Text>
                        <Text style={styles.countdownText2}>Parked at:</Text>
                        <Text style={styles.countdownText3}>Gate Veinavn 24</Text>   
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={{...styles.countdownTime, color: theme.colors.primary}}>25:13</Text>
                    </View>
                </Surface>
            </View>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Account")}>
                <List.Item
                    style={{padding: 20}}
                    left={() => <Avatar.Icon 
                        size={30}
                        icon="account"
                    />}
                    right={() => 
                        <MenuArrow/>}
                    title="Edit Account"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Cars")}>
                <List.Item
                    style={{padding: 20}}
                    left={() => 
                    <Avatar.Icon 
                        size={30}
                        icon="car"
                    />}
                    right={() => 
                        <MenuArrow/>}
                    title="Cars"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Parking")}>
                <List.Item
                    style={{padding: 20}}
                    left={() => 
                    <Avatar.Icon 
                        size={30}
                        icon="parking"
                    />}
                    right={() => <MenuArrow/>}
                    title="Parking"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("Settings")}>
                <List.Item
                    style={{padding: 20}}
                    left={() => 
                        <Avatar.Icon 
                            size={30}
                            icon="cog"
                            mode="contained"
                        />
                    }
                    right={() => <MenuArrow/>}
                    title="Settings"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => handlePress("History")}>
                <List.Item
                    style={{padding: 20}}
                    left={() => 
                        <Avatar.Icon 
                            size={30}
                            icon="history"
                        />
                    }
                    right={() => <MenuArrow/>}
                    title="History"
                />
            </TouchableOpacity>
        </View> 
    )
}

const styles = StyleSheet.create({
    profile: {
        alignItems: "center",
        marginVertical: 20,
    },
    profileContainer: {
        alignItems: "center",
        alignContent: "center",
        alignSelf: "stretch",
        borderWidth: 2,
        borderRadius: 12,
        marginTop: 36,
        height: 185,
    },
    profileName: {
        fontSize: 34,
        marginTop: 15,
        alignSelf: "center",
    },
    countdownContainer: {
        justifyContent: "space-between",
        marginTop: 15,
        height: 150,
        borderRadius: 12,
        padding: 25,
        flexDirection: "row",
        alignSelf: "stretch",
    },
    countdownText1: {
        fontSize: 24,
        fontWeight: 400,
        marginBottom: 5,
    }, 
    countdownText2: {
        fontSize: 13,
        fontWeight: 400,
    }, 
    countdownText3: {
        fontSize: 13,
        fontWeight: 400,
    }, 
    countdownTime: {
        fontSize: 35,
        fontWeight: 400,
    }, 
    list: {
        flexDirection: "column",
        padding: 0,
        alignSelf: "stretch",
        marginTop: 40,
    },
    listButton: {
    },
    listText: {
        fontSize: 16,
        marginTop: 4,
    },
})