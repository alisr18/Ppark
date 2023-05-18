import React, { createContext, useState, useEffect } from 'react';
import { Alert } from "react-native";
import { auth, db } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, onUserCreated, sendPasswordResetEmail } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator } from 'react-native-paper';
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [myChatUsers, setMyChatUsers] = useState(null)
    const [chatUsers, setChatUsers] = useState(null);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);

    const getMyChatUsers = async (id) => {

        let tmpArray2 = []
        const docRefC = collection(db, "chatrooms")

        await getDocs(query(docRefC)).then(res => res.docs.map(doc => {
            tmpArray2.push(doc.id)
        }))

        setMyChatUsers(tmpArray2)
        getChatUsers(tmpArray2, id);
    }

    const getChatUsers = async (collectedUsers, id) => {

        let tmpArray = []
        const docRefU = collection(db, "users")

        await getDocs(query(docRefU, where("uid", "!=", id))).then(res => res.docs.map(async doc => {
            await collectedUsers.forEach(chatroom_id => {
                let split = chatroom_id.split("-")
                if ((split[0] === id && split[1] === doc.id) || (split[1] === id && split[0] === doc.id)) {
                    console.log(doc.id)
                    console.log(doc.data())
                    tmpArray.push(doc.data())
                    setChatUsers(tmpArray)
                }
            })
        }))
    }

    const getUser = async() => {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            getCar(JSON.parse(storedUser));
        }
        setLoading(false);
    };

    const getUserData = async (id) => {
        const userDoc = doc(db, 'users', id);
        const uData = (await getDoc(userDoc)).data();
        console.log(uData)
        setUserData(uData)
    }

    const getCar = async(usr) => {
        const carsRef = doc(db, "cars", usr.uid); 
        const carsDoc = await getDoc(carsRef);
            
        if (carsDoc.exists()) {
            const carsData = carsDoc.data();  
            const carsArray = Object.values(carsData);
                
            const activeCar = carsArray.find((car) => car[2] === true);
            setActive(activeCar);
        }
    }

    const authListener = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            SecureStore.setItemAsync('user', JSON.stringify(currentUser));
            setUser(currentUser);
            getCar(currentUser);
        }
    });

    useEffect(() => {

        getUser();

        return () => {
            authListener();
        };
    }, []);

    useEffect(() => {
        if (user) {
            getUserData(user.uid)
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            getMyChatUsers(user.uid)
        }
    }, [user])

    if (loading) {
        return <ActivityIndicator style={{marginVertical: 250}} size="large"/>
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            userData,
            myChatUsers,
            chatUsers,
            setUser,
            getUserData,
            getMyChatUsers,
            active,
            setActive,
            login: async (email, password) => {
                await signInWithEmailAndPassword(auth, email, password);
            },
            logout: async () => {
                await signOut(auth);
                await SecureStore.deleteItemAsync('user');
                setUser(null);
            },
            register: async (email, password, onUserCreated) => {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                if (onUserCreated) {
                    onUserCreated(result.user);
                }
            },
            resetPassword: async (email) => {
                await sendPasswordResetEmail(auth, email);
                Alert.alert("Email sent to: ", email); // Outlook/hotmail blocks the emails from reaching the user. But it works with gmail
            },
        }}>
        {children}
        </AuthContext.Provider>
    );
};