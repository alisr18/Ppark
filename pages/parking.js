import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, Avatar, Text, IconButton } from "react-native-paper";

const Parking = () => {
    
    const navigate = useNavigation();
    
    return (
        <View style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal" 
            />
            <Text style={styles.text}>Parking</Text>
        </View>
    );
}

export default Parking;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        //backgroundColor: "#191C1B",
        alignItems: "center",
    },
    close: {
        //backgroundColor: "#357266",
        alignSelf: "flex-start",
        marginTop: 25,
    },
    text: {
    },
})