import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { IconButton, Text, Button } from "react-native-paper";
import { CardField, useStripe } from "@stripe/stripe-react-native";

function Booking({ navigation }) {
    const { confirmPayment } = useStripe();
    const [showModal, setShowModal] = useState(false);

    const handleGoBack = () => {
        navigation.goBack(); // Handle the go back action
    };

    const handleRentNow = () => {
        // Handle the rent now action
        setShowModal(true);
    };




    const handleConfirmPayment = async () => {
        // Call the confirmPayment function to process the payment
        const { error } = await confirmPayment();
        if (error) {
            // Handle the error
            console.log("Payment failed:", error);
        } else {
            // Payment succeeded
            console.log("Payment successful!");
            // Close the modal after successful payment
            setShowModal(false);
            // Proceed with other actions, such as navigating to a success screen
        }
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
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 16,
        },
        modalContent: {
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 16,
            width: "90%",
            maxWidth: 400,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 16,
            textAlign: "center",
        },
        cardField: {
            height: 50,
            marginBottom: 16,
        },
        confirmButton: {
            height: 50,
            marginTop: 16,
        },
        closeButton: {
            position: "absolute",
            top: 8,
            left: 8, // change this from 'right: 8' to 'left: 8'
            zIndex: 1,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="close"
                    size={24}
                    onPress={() => setShowModal(false)}
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
            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <IconButton icon="close" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Enter Card Details</Text>
                        <CardField
                            postalCodeEnabled={true}
                            placeholder={{
                                number: "4242 4242 4242 4242",
                            }}
                            cardStyle={{
                                backgroundColor: "#FFFFFF",
                                textColor: "#000000",
                            }}
                            style={styles.cardField}
                            onCardChange={(cardDetails) => {
                                console.log(cardDetails);
                            }}
                            onFocus={(focusedField) => {
                                console.log("focusField", focusedField);
                            }}
                        />
                        <Button
                            mode="contained"
                            onPress={handleConfirmPayment}
                            style={styles.confirmButton}
                            contentStyle={{ height: 50 }}
                        >
                            Confirm Payment
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Booking;

