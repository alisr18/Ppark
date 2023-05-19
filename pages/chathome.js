import React, {useState, useEffect, useContext} from 'react';
import {View, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import { AuthContext } from "../authContext";
import { Appbar, Avatar, Button, Divider, List, Text } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

export default function ChatHome({navigation}) {

    const { chatUsers, getMyChatUsers } = useContext(AuthContext);

    const isFocused = useIsFocused();

    useEffect(() => {

        if(isFocused){
            getMyChatUsers()
        }
    }, [isFocused])

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Messages" />
            </Appbar.Header>
            <ScrollView>
                {
                    chatUsers?.length ? chatUsers.map(chat => (
                        <>
                            <List.Item
                            title={chat.displayname}
                            key={chat.uid}
                            onPress={() => navigation.navigate('chat', {displayname: chat.displayname, uid: chat.uid})}
                            left={props => 
                                <Avatar.Image
                                    {...props}
                                    source={{ uri: chat.profilePicture ??  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}
                                />}
                            />
                            <Divider/>
                        </>
                    )) : 
                    <List.Item
                        title={"No Messages"}
                        key={"no_message"}
                        description="You have no messages or conversations with other users"
                    />
                }
            </ScrollView>
        </>
    )
}