import React, {useState, useEffect, useContext} from "react";
import { View, Text } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";

import { db } from "../firebaseConfig";
import {addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc} from "firebase/firestore";
import {AuthContext} from "../authContext";
import { Appbar, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";


export default function ChatScreen({user, route}) {
    const { getMyChatUsers } = useContext(AuthContext);
    const theme = useTheme()
    const navigate = useNavigation();

    const [messages, setMessages] = useState([]);
    const {uid} = route.params
    
    const [avatar, setAvatar] = useState()
    
    useEffect(() => {
        if (uid) {
            0
        }
    }, [uid])

    const getAllMessages = async () => {
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const docRef = collection(db, `chatrooms/${docid}/messages`)
        const allMessages = await getDocs(query(docRef, orderBy("createdAt", "desc"))).then(res => res.docs.map(doc => {
            return {
                ...doc.data(),
                user: {...doc.data().user, avatar: avatar ? avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"},
                createdAt: doc.data().createdAt.toDate(),
            }
        }))

        setMessages(allMessages)
    }
    useEffect(() => {
        getAllMessages()
    }, [])

    const onSend = (messageArray) => {
        console.log(messageArray)
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        console.log(mymsg)
        setDoc(doc(db, "chatrooms", docid),{

        })
        addDoc(collection(db, `chatrooms/${docid}/messages`), {...mymsg, createdAt: serverTimestamp()})
        getMyChatUsers(user.uid)
        getAllMessages()

    }

    const customtInputToolbar = props => {
        return (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: theme.colors.elevation.level5,
              borderTopWidth: 0,
              /* padding: 4,
              borderRadius: 25,
              margin: 6 */
            }}
          />
        );
      };

    const customBubble = (props) => {
        return (
          <Bubble
            {...props}
            textStyle={{
                right: {
                    color: theme.colors.onPrimaryContainer
                },
                left: {
                    color: theme.colors.onTertiaryContainer
                }
            }}
            wrapperStyle={{
                right: {
                    backgroundColor: theme.colors.primaryContainer
                },
                left: {
                    backgroundColor: theme.colors.tertiaryContainer
                }
            }}
          />
        )
      }

    return (
        <View style={{flex: 1}}>
            <Appbar>
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigate.goBack} />
                    <Appbar.Content title="user"/>
                </Appbar.Header>
            </Appbar>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                renderInputToolbar={props => customtInputToolbar(props)}
                renderBubble={props => customBubble(props)}
                user={{
                    _id: user.uid,
                }}
            />
        </View>
    )
}