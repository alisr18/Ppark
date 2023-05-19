import React, {useContext, useEffect, useState} from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import {IconButton, Text, Button, Dialog, TextInput, RadioButton} from "react-native-paper";
import { CardField, useStripe, confirmPayment } from "@stripe/stripe-react-native";
import firebase from 'firebase/app';
import axios from 'axios';
import {Controller, useForm} from "react-hook-form";
import {DateController} from "../components/DateController";
import {Input} from "../components/Input";
import {addDoc, collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {useNavigation} from "@react-navigation/native";
import {AuthContext} from "../authContext";

function Booking({ route, navigation }) {
    const { confirmPayment } = useStripe();
    const [showModal, setShowModal] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [totalEnd, setTotalend] = useState(new Date());  // Add this line
    const [cardDetails, setCardDetails] = useState(null);  // Add this line
    const {control: sessionForm, handleSubmit: handleSession, watch: watchSession, reset: setSessionForm, setValue: updateSession} = useForm({date: new Date()})

    const { spot } = route.params;
    const [date, setDate] = useState()
    const [loading, setLoading] = useState(false)
    const handleGoBack = () => {
        navigation.goBack(); // Handle the go back action
    };
    const {cars,active, user} = useContext(AuthContext)
    const handleRentNow = () => {
        // Handle the rent now action
        setShowModal(true);
    };


    const addbooking = async (booking) => {
        setLoading(true)
        const new_doc = {

            price: amount2,
            owner: spot.uid,
            car: booking.carID,
            renter: user.uid,
            address: spot.Address,
            endDate: booking.end_time,
            startTime: new Date()
        }
        console.log(new_doc)
        addDoc(collection(db, "orders"), new_doc)
            .then(() => {
                setDialog({...openDialog, add: false})
                setLoading(false)
            })
            .catch(error => console.log(error))
        const owner = await getDoc(doc(db, "users", spot.uid))





        await setDoc(doc(db, "parking_session", spot.id), {
            unavailable: booking.end_time
        }, { merge: true });

        await setDoc(doc(db, "users", spot.uid), {
            balance: owner.data().balance? owner.data().balance + amount2: amount2
        }, { merge: true });
    }

    const [openDialog, setDialog] = useState(
        {
            end_date: false,
            end_time: false,
            car: null,
            selectP: false,
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
                    amount: amount // replace with your amount
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
                await handleSession(addbooking)()
                setShowModal(false);
                successPayment()
            }
        } catch (error) {
            console.log("Payment failed:", error);
            alert("Payment failed");
            // Handle the error
        }
    };
    useEffect(() => {
        const endDateTime = watchSession('end_time');
        if (endDateTime) {
            setTotalend(endDateTime)
        }
    }, [watchSession("end_time")]);


    useEffect(() => {
        const car = watchSession("carID")
        const time = watchSession("end_time")
        if (car && time) setDisabled(false)
        else setDisabled(true)
    }, [watchSession("carID"), watchSession("end_time")])


    function Activecar() {
        if (active) {
            return(
                <RadioButton.Item key={active[1]} label={active[1] + " (Active)"} value={active[1]}/>
            ); 
        }
    }
        

    const now = new Date();
    const end = totalEnd ?? now
    let totalHours = (end - now)/3600000;
    const finalprice = (spot.price > 0 && totalHours > 0) ? (spot.price * totalHours).toFixed(2) : null;
    const amount = finalprice * 100;
    const amount2 = amount / 100;
    function SelectCar() {
        return (
            <Dialog visible={openDialog.selectP} onDismiss={() => setDialog({...openDialog, selectP: false})}>
                <Dialog.Title>Choose a car</Dialog.Title>
                <Dialog.Content>
                    <Controller
                        control={sessionForm}
                        name="carID"
                        defaultValue={active[1] ?? ""}
                        render={({ field: { onChange, value } }) => (
                            <RadioButton.Group onValueChange={onChange} value={value}>
                                <View>
                                    <Activecar/>
                                    {cars.map(park => (
                                            <RadioButton.Item key={park[1]} label={park[1]} value={park[1]} />
                                        ))  
                                    }
                                </View>
                            </RadioButton.Group>
                        )}

                    />

                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, selectP: false})}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }


    console.log(finalprice)
    const handleContactOwner = () => navigation.navigate('chat', {displayname: spot.Address ,uid: spot.uid});
    const successPayment = () => {
        navigation.navigate('MapScreen');
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
                <Text style={styles.hourlyRateHighlight}>{spot.price} NOK</Text>
            </View>

            <View>
                <Button mode="contained-tonal" style={styles.dialogInput} onPress={() => setDialog({...openDialog, selectP: true})}>{watchSession("carID") ?? "Select car"}</Button>
                <View style={{...styles.dialogInput, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{marginTop: 10}}>End Time:</Text>
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
                    name="end_time"
                    modalName="end_date"
                    open={openDialog.end_date}
                    setOpen={setDialog}
                />
                <DateController
                    control={sessionForm}
                    name="end_time"
                    modalName="end_time"
                    mode="time"
                    open={openDialog.end_time}
                    setOpen={setDialog}
                />




            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.hourlyRatePrefix}>Total cost (incl fees):</Text>
                <Text style={styles.totalCost}>{finalprice} NOK</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleRentNow}
                        style={styles.button}
                        contentStyle={{ height: 50 }}
                        disabled={disabled}
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
            <SelectCar/>
        </View>
    );
}

export default Booking;

