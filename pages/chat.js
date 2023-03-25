import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { auth, db } from "../firebaseConfig";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import Login from "./login";


export default function ChatOverviewScreen() {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    //lager en signout knapp, denne kan flyttes på ved enighet, TRENGER HJELP HER!!
    const onSignOut = () => {
        signOut(auth).catch(error => console.log(error));
        return (
            <Login setUser={null}></Login>
        )
    };

    //legger til logout knapp i header, dette blir rendered før noe vises til user
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={onSignOut}
                >
                    <AntDesign name={"logout"} size={24} color={green50} style={{marginRight: 10}} />
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    // Denne useLayoutEffecten gir oss en referanse til collection i firestore
    useLayoutEffect(() => {
        const collectionRef = collection(db, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            console.log('snapshot');
            // må være disse feltene under for å komme gjennom til giftedChat
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });
        return () => unsubscribe();
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(db, 'chats'), {
            _id,
            createdAt,
            text,
            user
        });
    }, []);
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                avatar: 'https://i.pravatar.cc/300'
            }}
        />
    )
}

import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatScreen from "./chatscreen";
import {green50} from "react-native-paper/src/styles/themes/v2/colors";
import login from "./login";






/*
const ChatOverviewScreen = () => {



    const [chats, setChats] = useState([
        { id: 1, name: 'John', message: 'Hello there!',  },
        { id: 2, name: 'Jane', message: 'How are you?',  },
        { id: 3, name: 'Bob', message: 'What are you up to?',},
    ]);

    const navigation = useNavigation();
    const handleChatPress = (chat) => {
        navigation.navigate('ChatScreen', { chat });
    };
    return (
        <SafeAreaView style={styles.container}>
            <List.Section style={styles.listSection}>
                <List.Subheader>Chats</List.Subheader>
                {chats.map((chat) => (
                    <List.Item
                        key={chat.id}
                        title={chat.name}
                        description={chat.message}
                        left={() => <Avatar.Text size={40} label={chat.name[0]} />}
                        right={() => <View style={styles.rightContainer}>
                            <Icon name="check-all" size={24} color="#aaa" />
                            <List.Icon icon="chevron-right" />
                        </View>}
                        onPress={() => handleChatPress(chat)}
                    />
                ))}
            </List.Section>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listSection: {
        flex: 1,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ChatOverviewScreen;

 */