import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { db } from "../firebaseConfig";
import {collection, getDocs, query, where, collectionGroup, getDoc} from "firebase/firestore";

export default function ChatHome({user, navigation}) {
    const [users, setUsers] = useState(null)
    const [myUsers, setMyUsers] = useState(null)

    const getMyUsers = async () => {

        let tmpArray2 = []
        const docRefC = collection(db, "chatrooms")

        await getDocs(query(docRefC)).then(res => res.docs.map(doc => {
            tmpArray2.push(doc.id)
            setMyUsers(tmpArray2)
        }))
    }
    const getUsers = async () => {
        console.log(myUsers)
        console.log(user)

        let tmpArray = []

        const docRefU = collection(db, "users")

        await getDocs(query(docRefU, where("uid", "!=", user.uid))).then(res => res.docs.map(async doc => {
            await myUsers.forEach(chatroom_id => {
                let split = chatroom_id.split("-")
                if ((split[0] === user.uid && split[1] === doc.id) || (split[1] === user.uid && split[0] === doc.id)) {
                    console.log(doc.id)
                    console.log(doc.data())
                    tmpArray.push(doc.data())
                    setUsers(tmpArray)
                }

            })

        }))




    }


    useEffect(() => {
        getMyUsers()
        getUsers()

        console.log(myUsers)

    }, [])

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
                data={users}
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