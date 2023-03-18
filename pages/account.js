import { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, Avatar, Text, IconButton } from "react-native-paper";
import {useNavigation } from '@react-navigation/native';

const Account = () => {
    
    const navigate = useNavigation();

    return (
        <View style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal" 
            />
            <Text style={styles.text}>Account</Text>
        </View>
    );
}

export default Account;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: "center",
    },
    close: {
        alignSelf: "flex-start",
        marginTop: 25,
    },
    text: {
    },
})