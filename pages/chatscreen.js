import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, Provider as PaperProvider, List, IconButton } from "react-native-paper";
import {useNavigation} from "@react-navigation/native";

const ChatScreen = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);


    const navigation = useNavigation();
    const sendMessage = () => {
        if (text.trim().length > 0) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: prevMessages.length, content: text.trim() },
            ]);
            setText("");
        }
    };

    return (
        <PaperProvider>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.messageList}>
                    {messages.map((message) => (
                        <List.Item key={message.id} title={message.content} />
                    ))}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        mode="outlined"
                        placeholder="Type your message"
                        value={text}
                        onChangeText={setText}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={sendMessage}>
                        Send
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    input: {
        flex: 1,
        marginRight: 8,
    },
});

export default ChatScreen;
