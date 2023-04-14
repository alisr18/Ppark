import React, { createContext, useState, useEffect } from 'react';
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, onUserCreated } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator } from 'react-native-paper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getUser = async() => {
            const storedUser = await SecureStore.getItemAsync('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        getUser();

        const authListener = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                SecureStore.setItemAsync('user', JSON.stringify(currentUser));
                setUser(currentUser);
            }
        });

        return () => {
            authListener();
        };
    }, []);

    if (loading) {
        return <ActivityIndicator size="large"/>
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            setUser,
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
        }}>
        {children}
        </AuthContext.Provider>
    );
};