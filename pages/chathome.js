import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { db } from "../firebaseConfig";
import {collection, getDocs, query, where} from "firebase/firestore";

export default function ChatHome({user, navigation}) {
    const [users, setUsers] = useState(null)
    // async funksjon som går inn i firestore og henter ut data om alle users i "users" dokumentet. Setter så dette inn i "users" variabel i useStaten.
    const getUsers = async () => {
        console.log(user)
        let tmpArray = []
        const docRef = collection(db, "users")
        await getDocs(query(docRef, where('uid', '!=', user.uid))).then(result => result.docs.map(doc => {
            let allUsers = doc.data()
            tmpArray.push(allUsers)
            setUsers(tmpArray)
        }))
    }

    useEffect(() => {
        console.log("hi")

        getUsers()
        console.log(users)

    }, [])

    const RenderCard = ({item}) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('chat', {displayname: item.displayname, uid: item.uid})}>
                <View style={styles.myCard}>
                    <Image source={{uri:'https://i.pravatar.cc'}} style={styles.img} />
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