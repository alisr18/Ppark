import React, {useState, useEffect, useContext} from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { db } from "../firebaseConfig";
import {collection, getDocs, query, where, collectionGroup, getDoc} from "firebase/firestore";
import { AuthContext } from "../authContext";
import { useIsFocused } from '@react-navigation/native';

export default function ChatHome({user, navigation}) {

    const { chatUsers, myChatUsers, getMyChatUsers } = useContext(AuthContext);
    console.log("samtale-id: ", myChatUsers)

    const isFocused = useIsFocused();

    useEffect(() => {
        console.log("Called")

        if(isFocused){
            getMyChatUsers(user.uid)
        }
        console.log("users:")
    }, [isFocused])

    const RenderCard = ({item}) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('chat', {displayname: item.displayname, uid: item.uid})}>
                <View style={styles.myCard}>
                    <Image source={{uri: item.profilePicture ? item.profilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}} style={styles.img} />
                    <View>
                        <Text style={styles.text}>
                            {item.displayname}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <FlatList
                data={chatUsers}
                renderItem={({item})=><RenderCard item={item} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    img: {width:60, height:60, borderRadius: 30, backgroundColor:"green"},
    text: {
        fontSize: 18,
        marginLeft: 15
    },
    myCard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "grey"
    }

});