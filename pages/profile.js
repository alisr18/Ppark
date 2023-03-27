import {useContext, useEffect, useState} from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, Text, Avatar, Card, Surface, List } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';
import { ThemeContext } from "../App";
import {auth, db} from "../firebaseConfig";
import {doc, getDoc} from "firebase/firestore";


const color1 = "#436278";
const color2 = "#357266";

export default function Profile({ user }) {


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

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            const userDoc = doc(db, 'users', user.uid);
            const userData = (await getDoc(userDoc)).data();

            setFname(userData.firstName);
            setLname(userData.lastName);


        };

        fetchUserData();
    }, []);



    return (
        <View style={{padding: 30}}>
            <View style={styles.profile} >
                <Surface style={{...styles.profileContainer, borderColor: theme.colors.surfaceDisabled}} elevation={0}>
                        <Avatar.Icon
                            size={70}
                            icon="account"
                            marginTop={20}
                            style={{backgroundColor: theme.colors.tertiaryContainer}}
                        />
                    <Text style={styles.profileName}>{fname} {lname}</Text>
                </Surface>

                <Surface style={styles.countdownContainer} elevation={3}>
                    <View>
                        <Text style={styles.countdownText1}>Time Remaining:</Text>
                        <Text style={{...styles.countdownText2, color: theme.colors.onSurfaceDisabled}}>Parked at:</Text>
                        <Text style={{...styles.countdownText3, color: theme.colors.onSurface}}>Gate Veinavn 24</Text>   
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={{...styles.countdownTime, color: theme.colors.primary}}>25:13</Text>
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
        </View> 
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
        marginTop: 15,
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
})