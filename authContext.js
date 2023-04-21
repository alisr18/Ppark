import React, { createContext, useState, useEffect } from 'react';
import { Alert } from "react-native";
import { auth, db } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, onUserCreated, sendPasswordResetEmail } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator } from 'react-native-paper';
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);

    useEffect(() => {

        const getUser = async() => {
            const storedUser = await SecureStore.getItemAsync('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                getCar(JSON.parse(storedUser));
            }
            setLoading(false);
        };

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

        getUser();

        const authListener = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                SecureStore.setItemAsync('user', JSON.stringify(currentUser));
                setUser(currentUser);
                getCar(currentUser);
            }
        });

        return () => {
            authListener();
        };
    }, []);

    if (loading) {
        return <ActivityIndicator style={{marginVertical: 250}} size="large"/>
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            setUser,
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