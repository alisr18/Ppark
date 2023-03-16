import { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Button, TextInput, Avatar, IconButton } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';

const Account = () => {
    
    const navigate = useNavigation();

    return (
        <View style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained" 
                iconColor="white"
            />
            <Text style={styles.text}>Account</Text>
        </View>
    );
}

export default Account;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#191C1B",
        alignItems: "center",
    },
    close: {
        backgroundColor: "#357266",
        alignSelf: "flex-start",
        marginTop: 25,
    },
    text: {
        color: "white",
    },
})