import { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, Avatar, IconButton, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
    
    const navigate = useNavigation();
    
    return (
        <View style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal" 
            />
            <Text style={styles.text}>Settings</Text>
        </View>
    );
}

export default Settings;

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