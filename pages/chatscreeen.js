import React, {useState, useEffect, useContext} from "react";
import { View, Text } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

import { db } from "../firebaseConfig";
import {addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc} from "firebase/firestore";
import {AuthContext} from "../authContext";


export default function ChatScreen({user, route}) {
    const { getMyChatUsers } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const {uid} = route.params
    console.log(uid)
    console.log(user.uid)

    const getAllMessages = async () => {
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const docRef = collection(db, `chatrooms/${docid}/messages`)
        const allMessages = await getDocs(query(docRef, orderBy("createdAt", "desc"))).then(res => res.docs.map(doc => {
            return {
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate()
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


    }

    return (
        <View style={{flex: 1}}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.uid,
                }}
            />
        </View>
    )
}