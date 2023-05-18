import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Portal, Dialog, Button, IconButton, TextInput, Text, Surface, List, Appbar } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from "../App";
import { db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { FormProvider, useController, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { AuthContext } from "../authContext";


const Cars = () => {
    const { user, active, setActive, cars, setCars } = useContext(AuthContext);

    const navigate = useNavigation();

    const theme = useContext(ThemeContext)

    const [changes, setChanges] = useState(null);

    const [openDialog, setDialog] = useState(
        {
            add: false,
            edit: false,
            delete: false
        }
    )

    const { control: addForm, handleSubmit: handleAdd, reset: resetAddForm } = useForm();
    const { control: editForm, handleSubmit: handleEdit, reset: resetEditForm } = useForm();


    // Add car to db
    const add = async(car) => {
        try {
            const docRef = doc(db, "cars", user.uid);
            const docSnap = await getDoc(docRef);
            const carInfo = [car.carName, car.regNr, false];


            if (docSnap.exists()) { // Adding to existing document
                await updateDoc(docRef, {
                    [car.regNr]: carInfo,
                });
            }
            else { // Creating new document
                await setDoc(docRef, {
                    [car.regNr]: carInfo,
                });
            }
            
            setDialog({...openDialog, add: false});
            console.log(car.carName, "added to the db");
            setChanges(changes+1);
        } 
        catch(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

      
    useEffect(() => {
        const getCars = async() => {
            const carsRef = doc(db, "cars", user.uid); 
            const carsDoc = await getDoc(carsRef);

            if (carsDoc.exists()) {
                const carsData = carsDoc.data();
                const carsArray = Object.values(carsData);
                const other = carsArray.filter((car) => car[2] === false);
                setCars(other);
                
                const activeCar = carsArray.find((car) => car[2] === true);
                setActive(activeCar);
            }
        }    
        getCars();
    }, [changes]);


    // Edit cars in db
    const edit = async(car) => {
        try {
            const docRef = doc(db, "cars", user.uid);
            const carsDoc = await getDoc(docRef);
            console.log("selector is here; ",selectedCar[0]);
            const carInfo = [car.carName, car.regNr, selectedCar[2]];
            console.log("selector 2 is here; ",selectedCar[2]);
            console.log("selector 1 is here; ",selectedCar[1]);
            console.log("selector 0 is here; ",selectedCar[0]);


            if (carsDoc.exists()) { 
                const updatedDoc = {...carsDoc.data()};
                delete updatedDoc[selectedCar[1]];

                await setDoc(docRef, updatedDoc).then(updateDoc(docRef, {
                    [car.regNr]: carInfo,
                }));
            }
            
            setDialog({...openDialog, edit: false});
            console.log(car.carName, "added to the db");
            setChanges(changes+1);
        } 
        catch(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    // Delete cars in db
    const deleteCar = async() => {
        try {     
            const docRef = doc(db, "cars", user.uid);
            const carsDoc = await getDoc(docRef);
            
            if (carsDoc.exists()) {
                const updatedDoc = {...carsDoc.data()};
                delete updatedDoc[selectedCar];
                
                await setDoc(docRef, updatedDoc);
                setChanges(changes+1);
            }
            else {
                console.log("Document does not exist");
            }
        } 
        catch(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    const activate = async() => {
        if (active !== undefined) {
            try {
                const docRef = doc(db, "cars", user.uid);
                const carsDoc = await getDoc(docRef);
                
                const car = [active[0], active[1], false];
                const car2 = [selectedCar[0], selectedCar[1], true]
                
                if (carsDoc.exists()) { 
                    await updateDoc(docRef, {
                        [active[1]]: car,
                        [selectedCar[1]]: car2,
                    });
                }

                setChanges(changes+1);
            }
            catch(error) {
                const errorCode = error.code;
                const errorMessage = error.message;
            }
        }
        else {
            try {
                const docRef = doc(db, "cars", user.uid);
                const carsDoc = await getDoc(docRef);
                
                const car = [selectedCar[0], selectedCar[1], true]
                
                if (carsDoc.exists()) { 
                    await updateDoc(docRef, {
                        [selectedCar[1]]: car,
                    });
                }

                setChanges(changes+1);
            }
            catch(error) {
                const errorCode = error.code;
                const errorMessage = error.message;
            }
        }

    }

    const deactivate = async() => {
        try {
            const docRef = doc(db, "cars", user.uid);
            const carsDoc = await getDoc(docRef);
            
            const car = [selectedCar[0], selectedCar[1], false];
            
            if (carsDoc.exists()) { 
                await updateDoc(docRef, {
                    [selectedCar[1]]: car,
                });
            }
            
            setChanges(changes+1);
        }
        catch(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    const styles = StyleSheet.create({
        page: {
            flex: 1,
            
        },
        close: {
            alignSelf: "flex-start",
            marginTop: 25,
        },
        carContainer: {
            alignItems: "center",
            alignSelf: "center",
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
            marginTop: 40,
        },
        text: {
            alignSelf: "flex-start",
            fontSize: 14,
            position: "absolute",
            marginLeft: 20,
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
        dialogInput: {
            marginBottom: 10
        },
    })

    const [selectedCar, setSelectedCar] = useState(null);
    function DeleteDialog() {
        return (
            <Dialog visible={openDialog.delete} onDismiss={() => setDialog({...openDialog, delete: false})}>
                <Dialog.Title>Delete Car</Dialog.Title>
                <Dialog.Content>
                    <Text>Do you want to delete this car?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, delete: false})}>Cancel</Button>
                    <Button textColor={theme.colors.error} onPress={() => deleteCar().then(setDialog({...openDialog, delete: false}))}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }

    function EditDialog() {
        if (selectedCar != null) {
            return (
                <Dialog visible={openDialog.edit} onDismiss={() => setDialog({...openDialog, edit: false})}>
                    <Dialog.Title>Edit Car</Dialog.Title>
                    <Dialog.Content>
                        <Input control={editForm} defaultValue={selectedCar[0]} rules={{required: true}} name="carName" label="Car Name" style={styles.dialogInput}/>
                        <Input control={editForm} defaultValue={selectedCar[1]} rules={{required: true}} name="regNr" label="Registration Number" style={styles.dialogInput}/>                
                    </Dialog.Content>
                    <Dialog.Actions>
                        <ActivationBtn/>
                        <Button mode='contained' value="submit" onPress={handleEdit(p => edit(p, user))}>Edit</Button>                
                    </Dialog.Actions>               
                </Dialog>
            )
        }
        else {
            return null;
        }  
    }

    function ActivationBtn() {
        if (selectedCar[2]) {
            return (
                <Button style={{alignSelf: "stretch"}} mode='contained' onPress={() => deactivate().then(setDialog({...openDialog, edit: false}))}>Deactivate</Button>
            )
        }
        else {
            return (
                <Button style={{alignSelf: "stretch"}} mode='contained' onPress={() => activate().then(setDialog({...openDialog, edit: false}))}>Activate</Button>
            )
        }
    }

    function AddDialog() {
        return (
            <Portal>
                <Dialog visible={openDialog.add} onDismiss={() => setDialog({...openDialog, add: false})}>
                    <Dialog.Title>Add Car</Dialog.Title>
                    <Dialog.Content>
                        <Input control={addForm} rules={{required: true}} name="carName" label="Car Name" style={styles.dialogInput}/>
                        <Input control={addForm} rules={{required: true}} name="regNr" label="Registration Number" style={styles.dialogInput}/>
                        <Button mode='contained' value="submit" onPress={handleAdd(p => add(p, user))}>Add</Button>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        )
    }


    function CarButtons(car) {
        return (
            <View style={{flexDirection: "row"}}>
                <IconButton icon="delete" backgroundColor={theme.colors.errorContainer} iconColor={theme.colors.onErrorContainer} onPress={() => {setSelectedCar(car.car[1]); setDialog({...openDialog, delete: true})}}/>
                <Button mode="contained" onPress={() => {resetEditForm(); setSelectedCar(car.car); setDialog({...openDialog, edit: true})}}>Edit</Button>
            </View>
        )
    }

    function ActiveCar() {
        if (active != null) {
            return (
                <Surface style={styles.carContainer} elevation={0}>
                    <Text style={styles.carName}>{active[0]}</Text>
                    <Text style={styles.carStatus}>Active</Text>
                    <Text style={styles.carPlate}>{active[1]}</Text>
                    <Button style={styles.carEdit} mode="contained" onPress={() => {resetEditForm(); setSelectedCar(active); setDialog({...openDialog, edit: true})}}>Edit</Button>
                </Surface>
            )
        }
        else {
            return (
                <Surface style={styles.carContainer} elevation={0}>
                    <Text style={{fontSize: 32, alignSelf: "center", marginHorizontal: 55}}>No active cars</Text>
                </Surface>
            )
        }
    }
    
    return (
        <View style={styles.page}>
            <Appbar>
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigate.goBack}/>
                </Appbar.Header>
            </Appbar>
            
            <ActiveCar/>
            
            <ScrollView style={styles.otherCars}>
                <Text style={styles.text}>Other Cars:</Text>

                {cars.map((car, index) => ( 
                    <List.Item key={index} left={(props) => <List.Icon icon="car" {...props}/>} right={() => <CarButtons car={car}/>} title={car[0]} description={car[1]}/>  
                ))}
                
            </ScrollView>

            <View style={{position: "absolute", bottom: 25, right: 30}}>
                <IconButton
                    icon="plus"
                    mode="contained"
                    style={styles.addButton}
                    onPress={() =>{resetAddForm(); setDialog({...openDialog, add: true})}}
                />
            </View>

            <AddDialog/>
            <DeleteDialog/>
            <EditDialog/>

        </View>
    );
}

export default Cars;