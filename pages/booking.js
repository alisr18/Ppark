import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text, Button } from "react-native-paper";

function Booking({ navigation }) {
    const handleGoBack = () => {
        navigation.goBack(); // Handle the go back action
    };

    const handleRentNow = () => {
        // Handle the rent now action
    };

    const handleContactOwner = () => {
        // Handle the contact owner action
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
        },
        backButton: {
            marginRight: 10,
        },
        headerText: {
            fontSize: 24,
            fontWeight: "bold",
            flex: 1,
        },
        hourlyRateContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        hourlyRatePrefix: {
            fontSize: 18,
        },
        hourlyRateHighlight: {
            fontSize: 18,
            color: "#fff",
            backgroundColor: "#288c66",
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
        },
        button: {
            flex: 1,
            height: 50,
            marginRight: 10,
        },
        hourlyRate: {
            fontSize: 15,
            marginBottom: 20,
        },
        sectionContainer: {
            marginTop: 80,
        },
        sectionContainer2: {
            marginTop: 2,
        },
        totalCost: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#288c66",
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    onPress={handleGoBack}
                    style={styles.backButton}
                />
                <Text style={styles.headerText}>Order Confirmation</Text>
            </View>
            <View style={styles.hourlyRateContainer}>
                <Text style={styles.hourlyRatePrefix}>Hourly Rate: </Text>
                <Text style={styles.hourlyRateHighlight}>$0.70</Text>
            </View>
            <View style={styles.sectionContainer2}>
            <Text style={styles.hourlyRatePrefix}>Rent until: </Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.hourlyRatePrefix}>Total cost (incl fees):</Text>
                <Text style={styles.totalCost}>$4.20</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleRentNow}
                        style={styles.button}
                        contentStyle={{ height: 50 }}
                    >
                        Rent Now
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={handleContactOwner}
                        style={styles.button}
                        contentStyle={{ height: 50 }}
                    >
                        Contact Owner
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default Booking;
