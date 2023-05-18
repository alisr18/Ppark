import React, {useEffect, useState} from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import {IconButton, Text, Button, Dialog, TextInput} from "react-native-paper";
import { CardField, useStripe, confirmPayment } from "@stripe/stripe-react-native";
import firebase from 'firebase/app';
import axios from 'axios';
import {useForm} from "react-hook-form";
import {DateController} from "../components/DateController";
import {Input} from "../components/Input";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebaseConfig";

function Booking({ route, navigation }) {
    const { confirmPayment } = useStripe();
    const [showModal, setShowModal] = useState(false);
    const [totalEnd, setTotalend] = useState(new Date());  // Add this line
    const [cardDetails, setCardDetails] = useState(null);  // Add this line
    const {control: sessionForm, handleSubmit: handleSession, watch: watchSession, reset: setSessionForm, setValue: updateSession} = useForm({date: new Date()})


    const { spot } = route.params;
    const [date, setDate] = useState()
    const [loading, setLoading] = useState(false)
    const handleGoBack = () => {
        navigation.goBack(); // Handle the go back action
    };

    const handleRentNow = () => {
        // Handle the rent now action
        setShowModal(true);
    };


    const addbooking = async (booking) => {
        setLoading(true)
        const new_doc = {
            price: parking.price,

            uid: user.uid
        }
        console.log(new_doc)
        addDoc(collection(db, "orders"), new_doc)
            .then(() => {
                setDialog({...openDialog, add: false})
                setLoading(false)
            })
            .catch(error => console.log(error))
    }

    const [openDialog, setDialog] = useState(
        {
            end_date: false,
            end_time: false,
            car: null
        }
    )

    const openSessionDialog = () => {
        setDialog({ ...openDialog, session: true });
    };

    const handleConfirmPayment = async () => {

        if (!cardDetails) {
            // Show an alert or perform any other desired action to indicate that all fields are required
            alert("Please enter card details.");
            return;
        }

        try {
            const response = await axios.post(
                "https://us-central1-ppark-998b8.cloudfunctions.net/createPaymentIntent",
                {
                    amount: 420, // replace with your amount
                }
            );
            const { clientSecret } = response.data;

            const paymentResult = await confirmPayment(clientSecret, {
                paymentMethodType: "Card",
                card: cardDetails,
            });
            console.log(paymentResult);

            if (paymentResult.error) {
                console.log("Payment failed in Stripe:", paymentResult.error.message);
                alert("Payment failed: " + paymentResult.error.message);
            } 
            else if (paymentResult.paymentIntent) {
                console.log("Payment", paymentResult.paymentIntent.status);
                alert("Payment " + paymentResult.paymentIntent.status); 
                setShowModal(false);
            }
        } catch (error) {
            console.log("Payment failed:", error);
            alert("Payment failed");
            // Handle the error
        }
    };
    useEffect(() => {const endDateTime = watchSession('end_time');
        if (endDateTime) {
            const totalEndHours = endDateTime.getHours();
            setTotalend(totalEndHours)
        }
    }, [watchSession("end_time")]);


    const end = totalEnd.getTime()
    const now = new Date();
    let totalStart = now.getTime();
    console.log(end)
    const handleContactOwner = () => navigation.navigate('chat', {displayname: spot.Address ,uid: spot.uid});

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
        button2: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: '#288c66',
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
                    onPress={() => handleGoBack()}
                />
                <Text style={styles.headerText}>Order Confirmation</Text>
            </View>
            <View style={styles.hourlyRateContainer}>
                <Text style={styles.hourlyRatePrefix}>Hourly Rate: </Text>
                <Text style={styles.hourlyRateHighlight}>$0.70</Text>
            </View>

            <View>
                <Button mode="contained-tonal" style={styles.dialogInput} onPress={() => setDialog({...openDialog, selectP: true})}>{watchSession("parkingID") ? parkingList.filter(park => park.id == watchSession("parkingID"))[0].Address  : "Select Car"}</Button>
                <View style={{...styles.dialogInput, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text>End Time:</Text>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <Button onPress={() => setDialog({...openDialog, end_date: true})} uppercase={false} mode="contained-tonal" style={{marginRight: 5}}>
                            {watchSession("end_time")?.toLocaleDateString() ?? "Date"}


                        </Button>
                        <Button onPress={() => setDialog({...openDialog, end_time: true})} uppercase={false} mode="contained-tonal">
                            {watchSession("end_time") ? `${watchSession("end_time")?.getHours()}:${watchSession("end_time")?.getMinutes()}` : "Time"}
                        </Button>
                    </View>
                </View>
                <DateController
                    control={sessionForm}
                    name="start_time"
                    modalName="start_date"
                    open={openDialog.start_date}
                    defaultValue={date}
                    setOpen={setDialog}
                />
                <DateController
                    control={sessionForm}
                    name="start_time"
                    modalName="start_time"
                    mode="time"
                    open={openDialog.start_time}
                    defaultValue={date}
                    setOpen={setDialog}
                />
                <DateController
                    control={sessionForm}
                    name="end_time"
                    modalName="end_date"
                    open={openDialog.end_date}
                    defaultValue={date}
                    setOpen={setDialog}
                />
                <DateController
                    control={sessionForm}
                    name="end_time"
                    modalName="end_time"
                    mode="time"
                    open={openDialog.end_time}
                    defaultValue={date}
                    setOpen={setDialog}
                />




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
                        <IconButton
                            icon="close"
                            size={24}
                            onPress={() => setShowModal(false)}
                        />
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
                                setCardDetails(cardDetails);
                            }}
                            onFocus={(focusedField) => {
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

