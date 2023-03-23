import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, StatusBar } from "react-native";
import { Button, TextInput, Avatar, Text, IconButton, Menu, List, Dialog, Appbar } from "react-native-paper";
import { ThemeContext } from "../App";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Parking = () => {

    const [openDialog, setDialog] = useState(
        {
            add: false,
            edit: false,
            delete: false
        }
    )

    const [editForm, setEditForm] = useState({
        StreetName: "",
        Region: "",
        Zip: "",
    })
    
    const navigate = useNavigation();

    const theme = useContext(ThemeContext)

    const { top } = useSafeAreaInsets();

    function ParkingButtons() {
        return (
            <View style={{flexDirection: "row"}}>
                <IconButton icon="delete" backgroundColor={theme.colors.errorContainer} iconColor={theme.colors.onErrorContainer} onPress={() => setDialog({...openDialog, delete: true})}/>
                <Button mode="contained" onPress={() => setDialog({...openDialog, edit: true})}>Edit</Button>
            </View>
        )
    }

    function AddDialog() {
        return (
            <Dialog visible={openDialog.edit} onDismiss={() => setDialog({...openDialog, edit: false})}>
                <Dialog.Title>Edit Parking</Dialog.Title>
                <Dialog.Content>
                    <TextInput mode="outlined" value={editForm.StreetName} style={styles.dialogInput} label="Street Name" onChange={e => setEditForm({...editForm, StreetName: e.nativeEvent.text})}/>
                    <TextInput mode="outlined" value={editForm.Region} style={styles.dialogInput} label="Region" onChange={e => setEditForm({...editForm, Region: e.nativeEvent.text})}/>
                    <TextInput mode="outlined" value={editForm.Zip} style={styles.dialogInput} label="Zip Code" onChange={e => setEditForm({...editForm, Zip: e.nativeEvent.text})}/>
                    <Button style={{marginVertical: 10}} mode='contained'>Create</Button>
                </Dialog.Content>
            </Dialog>
        )
    }

    function EditDialog() {
        return (
            <Dialog visible={openDialog.edit} onDismiss={() => setDialog({...openDialog, edit: false})}>
                <Dialog.Title>Edit Parking</Dialog.Title>
                <Dialog.Content>
                    <TextInput mode="outlined" value={editForm.StreetName} style={styles.dialogInput} label="Street Name" onChange={e => setEditForm({...editForm, StreetName: e.nativeEvent.text})}/>
                    <TextInput mode="outlined" value={editForm.Region} style={styles.dialogInput} label="Region" onChange={e => setEditForm({...editForm, Region: e.nativeEvent.text})}/>
                    <TextInput mode="outlined" value={editForm.Zip} style={styles.dialogInput} label="Zip Code" onChange={e => setEditForm({...editForm, Zip: e.nativeEvent.text})}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button style={{alignSelf: "stretch"}} mode='contained'>Create</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }

    function DeleteDialog() {
        return (
            <Dialog visible={openDialog.delete} onDismiss={() => setDialog({...openDialog, delete: false})}>
                <Dialog.Title>Delte Parking Spot</Dialog.Title>
                <Dialog.Content>
                    <Text>Do you want to delete this parking spot?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, delete: false})}>Cancel</Button>
                    <Button textColor={theme.colors.error} onPress={() => console.log('Deleted Parking Spot')}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }

    return (
        <View style={styles.page}>
            <Appbar>
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigate.goBack} />
                </Appbar.Header>
            </Appbar>
            <View style={{alignItems: "center"}}>
                <Text style={styles.headline}>Parking</Text>
            </View>
            <View>
                <List.Item left={(props) => <List.Icon icon="parking" {...props}/>} right={() => <ParkingButtons/>} title="Gatenavn 24" description="4034 Stavanger"/>
                <List.Item left={(props) => <List.Icon icon="parking" {...props}/>} right={() => <ParkingButtons/>} title="Veinavn 37" description="4876 Grimstad"/> 
            </View>

            <View style={{position: "absolute", bottom: 25, right: 30}}>
                <IconButton
                    icon="plus"
                    mode="contained"
                    style={styles.addButton}
                />
            </View>

            <EditDialog/>

            <DeleteDialog/>
        </View>
    );
}

export default Parking;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        //backgroundColor: "#191C1B",
    },
    close: {
        //backgroundColor: "#357266",
        position: "absolute",
        margin: 15,
    },
    dialogInput: {
        marginBottom: 10
    },
    headline: {
        fontSize: 30,
        marginTop: 30,
        marginBottom: 60
    },
    addButton: {
        width: 56,
        height: 56,
    },
})