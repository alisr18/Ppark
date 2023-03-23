import { useContext, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { Button, IconButton, TextInput, Text, Avatar, Surface } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from "../App";
import { db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, getDoc} from "firebase/firestore";


const Cars = ({route}) => {
    const {user} = route.params;
    const navigate = useNavigation();

    const theme = useContext(ThemeContext)

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [carName, setCarName] = useState(null);
    const [regNr, setRegNr] = useState(null);

    const handleModal = () => {
        setAddModalVisible(() => !addModalVisible);
    }

    const add = async() => {
        console.log("Add pressed");
        
        try {
            console.log(user.uid);
            
            const docRef = doc(db, "cars", user.uid);
            const docSnap = await getDoc(docRef);
            const car = [carName, regNr];

            if (docSnap.exists()) {
                console.log("Adding to existing document");

                await updateDoc(docRef, {
                    [regNr]: car,
                });
            }
            else {
                console.log("Creating new document")

                await setDoc(docRef, {
                    [regNr]: car,
                });
            }
            
            setRegNr('');
            setCarName('');
            console.log(carName, "added to the db");
            handleModal();
        } 
        catch(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    const edit = () => {
        console.log("Edit pressed");
    }


    const styles = StyleSheet.create({
        page: {
            flex: 1,
            alignItems: "center",
        },
        close: {
            alignSelf: "flex-start",
            marginTop: 25,
        },
        carContainer: {
            alignItems: "center",
            marginTop: 15,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: "#3F4946",    
            height: 185,
            width: 318,
            flexDirection: "row",
        },
        carName: {
            fontSize: 32,
            alignSelf: "flex-start",
            position: "absolute",
            top: 35,
            left: 25,
        },
        carStatus: {
            fontSize: 14,
            color: theme.colors.primary,
            alignSelf: "flex-start",
            position: "absolute",
            top: 15,
            right: 35,
        },
        carPlate: {
            fontSize: 20,
            color: "#89938F",
            alignSelf: "flex-start",
            position: "absolute",
            top: 75,
            left: 25,
        },
        carEdit: {
            borderRadius: 100,
            alignSelf: "flex-end",
            position: "absolute",
            bottom: 15,
            right: 25,
        },
        otherCars: {
            flexDirection: "column",
            marginTop: 50,
        },
        text: {
            alignSelf: "flex-start",
            fontSize: 14,
            position: "absolute",
            left: -160,
        },
        listButton: {
            marginTop: 40,
            marginBottom: 15,
            flexDirection: "row",
        },
        listText: {
            fontSize: 16,
            marginTop: 4,
            position: "absolute",
            left: -120,
        },
        listIcon: {
            backgroundColor: theme.colors.background
        },
        addButton: {
            width: 56,
            height: 56,
        },
        backgroundModal: {
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            backgroundColor: theme.colors.secondaryContainer, 
            height: 300,
            width: 318,
            borderRadius: 12,
        },
        addField: {
            marginTop: 10,
            marginHorizontal: 20,
        },
        addCar: {
            marginTop: 20,
            marginHorizontal: 100,
            backgroundColor: theme.colors.secondary,
        },
    })
    
    return (
        <SafeAreaView style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal" 
            />
            
            <Surface style={styles.carContainer} elevation={0}>
                <Text style={styles.carName}>Volvo XC70</Text>
                <Text style={styles.carStatus}>Active</Text>
                <Text style={styles.carPlate}>NF38293</Text>
                <Button style={styles.carEdit} mode="contained" onPress={edit}>Edit</Button>
            </Surface>
            
            <View style={styles.otherCars}>
                <Text style={styles.text}>Other Cars:</Text>
                <TouchableOpacity style={styles.listButton}>
                    <Avatar.Icon 
                        size={30}
                        icon="car"
                        style={{...styles.listIcon, position: "absolute", left: -170}}
                    />
                    <Text style={styles.listText}>Volkswagen eGolf</Text>
                    <Avatar.Icon 
                        size={30}
                        icon="menu-right"
                        style={{ ...styles.listIcon, position: "absolute", left: 140}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listButton}>
                    <Avatar.Icon 
                        size={30}
                        icon="car"
                        style={{...styles.listIcon, position: "absolute", left: -170}}
                    />
                    <Text style={styles.listText}>Ferrari 812 gts</Text>
                    <Avatar.Icon 
                        
                        size={30}
                        icon="menu-right"
                        style={{...styles.listIcon, position: "absolute", left: 140}}
                    />
                </TouchableOpacity>
            </View>

            <View style={{position: "absolute", bottom: 25, right: 30}}>
                <IconButton
                    icon="plus"
                    mode="contained"
                    style={styles.addButton}
                    onPress={handleModal}
                />
            </View>

            <Modal 
                visible={addModalVisible}
                animationType={"fade"}
                transparent={true}
            >
                <View style={styles.backgroundModal}>
                    <View style={styles.modalView}>
                        <IconButton 
                            icon={"close"}
                            style={{alignSelf: "flex-end"}} 
                            onPress={handleModal}
                        />
                        <Text style={{textAlign: "center"}}>Add a car</Text>
                        <TextInput
                            mode="outlined"
                            label="Car Name"
                            value={carName}
                            onChangeText={setCarName}
                            style={styles.addField}
                        />
                        <TextInput
                            mode="outlined"
                            label="Registration Number"
                            value={regNr}
                            onChangeText={setRegNr}
                            style={styles.addField}
                        />
                        <Button 
                            style={styles.addCar}
                            onPress={add}
                            textColor={theme.colors.onSecondary}
                        >
                            Add
                        </Button>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

export default Cars;