import React, {useState, useEffect, useContext} from 'react';
import {View, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import { AuthContext } from "../authContext";
import { Avatar, Divider, List, Text } from 'react-native-paper';
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
        <ScrollView>
            {
                chatUsers && chatUsers.map(chat => (
                    <>
                        <List.Item
                        title={chat.displayname}
                        description="Item description"
                        onPress={() => navigation.navigate('chat', {displayname: chat.displayname, uid: chat.uid})}
                        left={props => 
                            <Avatar.Image
                                {...props}
                                source={{ uri: chat.profilePicture ??  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}
                            />}
                        />
                        <Divider/>
                    </>
                ))
            }
        </ScrollView>
    )
}