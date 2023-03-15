import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation } from '@react-navigation/native';
import ChatScreen from "./chatscreen";




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