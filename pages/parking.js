import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, FlatList, Animated } from "react-native";
import { Button, TextInput, Avatar, Text, IconButton, Menu, List, Dialog, Appbar, Surface, Divider } from "react-native-paper";
import { ThemeContext } from "../App";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDoc, collection, doc, getDoc, getDocs, where, setDoc, updateDoc, query, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FormProvider, useController, useForm } from "react-hook-form";
import { Input } from "../components/Input";


export const getParking = async (user_id) => {
    let tmpArray = []
    const docRef = collection(db, "parking")
    await getDocs(query(docRef, where("uid", "==", user_id))).then(res => res.docs.map(doc => {
        let tmp = doc.data()
        tmp.id = doc.id
        tmpArray.push(tmp)
    }))
    .catch(error => console.log(error))

    return(tmpArray)
}

export const getParkingDetail = async (id) => {
    let tmpObj = null
    const docRef = doc(db, "parking", id)
    await getDoc(docRef).then(res => {
        let tmp = res.data()
        tmp.id = res.id
        tmpObj = tmp
    })

    return(tmpObj)
}

const Parking = ({ route }) => {

    const {user} = route.params

    const [openDialog, setDialog] = useState(
        {
            add: false,
            edit: false,
            delete: false
        }
    )

    const {control: editForm, handleSubmit: handleEdit, reset: setEditForm} = useForm()

    const {control: addForm, handleSubmit: handleAdd, reset: resetAddForm} = useForm()

    const [parkingList, setParkingList] = useState([])

    const [delteID, setDeleteID] = useState("")
    
    const navigate = useNavigation();

    const theme = useContext(ThemeContext)

    const updateParking = async () => {
        const parkingArray = await getParking(user.uid)
        setParkingList(parkingArray)
    }

    const handleEditSubmit = (d) => console.log(d)

    useEffect(() => {
        updateParking()
    }, [])

    const addParking = async (parking) => {
        parking.uid = user.uid
        addDoc(collection(db, "parking"), parking)
            .then(() => {
                setDialog({...openDialog, add: false})
                updateParking()
            })
            .catch(error => console.log(error))
    }

    const delParking = async (id) => {
        deleteDoc(doc(db, "parking", id)).then(() => {
            updateParking()
            setDialog({...openDialog, delete: false})
        }).catch(error => console.log(error))
    }

    const openEdit = async (id) => {
        let parking = await getParkingDetail(id)
        setEditForm(parking)
        setDialog({...openDialog, edit: true})
    }
    
    const openDelete = async (id) => {
        setDeleteID(id)
        setDialog({...openDialog, delete: true})
    }

    function ParkingButtons(props) {
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <IconButton icon="delete" backgroundColor={theme.colors.errorContainer} iconColor={theme.colors.onErrorContainer} onPress={() => openDelete(props.id)}/>
                <Button mode="contained" buttonColor={theme.colors.tertiaryContainer} textColor={theme.colors.onTertiaryContainer} onPress={() => openEdit(props.id)}>Edit</Button>
                <IconButton icon={props.active ?? false ? "pause" : "play"} backgroundColor={theme.colors.primary} iconColor={theme.colors.onPrimary} onPress={() => console.log("Start pressed")}/>
            </View>
        )
    }

    function AddDialog() {
        return (
            <Dialog visible={openDialog.add} onDismiss={() => setDialog({...openDialog, add: false})}>
                <Dialog.Title>Add Parking</Dialog.Title>
                <Dialog.Content>
                        <Input control={addForm} rules={{required: true}} name="Address" label="Address" style={styles.dialogInput}/>
                        <Input control={addForm} rules={{required: true}} name="City" label="City" style={styles.dialogInput}/>
                        <Input control={addForm} rules={{required: true, valueAsNumber: true}} keyboardType='numeric' name="Zip" label="Zip Code" style={styles.dialogInput}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, add: false})}>Cancel</Button>
                    <Button mode='contained' value="submit" onPress={handleAdd(p => addParking(p, user))}>Create</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }

    function EditDialog() {
        return (
                <Dialog visible={openDialog.edit} onDismiss={() => setDialog({...openDialog, edit: false})}>
                    <Dialog.Title>Edit Parking</Dialog.Title>
                    <Dialog.Content>
                            <Input control={editForm} rules={{required: true}} name="Address" label="Address" style={styles.dialogInput}/>
                            <Input control={editForm} rules={{required: true}} name="City" label="City" style={styles.dialogInput}/>
                            <Input control={editForm} rules={{required: true}} keyboardType='numeric' name="Zip" label="Zip Code" style={styles.dialogInput}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialog({...openDialog, edit: false})}>Cancel</Button>
                        <Button mode='contained' value="submit" onPress={handleEdit(handleEditSubmit)}>Create</Button>
                    </Dialog.Actions>
                </Dialog>
        )
    }

    function DeleteDialog() {
        return (
            <Dialog visible={openDialog.delete} onDismiss={() => setDialog({...openDialog, delete: false})}>
                <Dialog.Title>Delte Parking Spot</Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to delete this parking spot?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, delete: false})}>Cancel</Button>
                    <Button textColor={theme.colors.error} onPress={() => delParking(delteID)}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }
    
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const boxWidth = scrollViewWidth * 0.8;
    const boxDistance = scrollViewWidth - boxWidth;
    const halfBoxDistance = boxDistance / 2;

    const styles = StyleSheet.create({
        page: {
            flex: 1,
            //backgroundColor: "#191C1B",
        },
        carContainer: {
            borderRadius: 12,
            height: 185,
            padding: 16,
            width: boxWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        },
        carName: {
            fontSize: 28,
            alignSelf: "flex-start",
        },
        carStatus: {
            fontSize: 14,
            color: theme.colors.primary,
        },
        carPlate: {
            fontSize: 20,
            color: theme.colors.outline,
        },
        carEdit: {
        },
        dialogInput: {
            marginBottom: 10,
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
    const pan = useRef(new Animated.ValueXY()).current;

    function RenderCard({item, index}) {
        return (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: pan.x.interpolate({
                      inputRange: [
                        (index - 1) * boxWidth - halfBoxDistance,
                        index * boxWidth - halfBoxDistance,
                        (index + 1) * boxWidth - halfBoxDistance, // adjust positioning
                      ],
                      outputRange: [0.85, 1, 0.85], // scale down when out of scope
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}>
              <Surface style={styles.carContainer} elevation={5}>
                  <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                      <View>
                          <Text style={styles.carName}>Gatenavn 123</Text>
                          <Text style={styles.carPlate}>Until 18:00</Text>
                      </View>
                      <Text style={styles.carStatus}>Active for 23:21</Text>
                  </View>
                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
                      <Text style={{...styles.carPlate, justifyContent: "flex-end"}}>56kr per hour</Text>
                      <Button style={styles.carEdit} mode="contained" onPress={() => console.log("Stop pressed")}>Stop</Button>
                  </View>
              </Surface>
            </Animated.View>
        )
    }

    return (
        <View style={styles.page}>
            <Appbar>
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigate.goBack} />
                </Appbar.Header>
            </Appbar>
            <FlatList
            horizontal
            data={[{body: () => <Text>Yo</Text>, elevation: 3}, {body: () => <IconButton icon="plus"/>, elevation: 0}, {body: () => <IconButton icon="plus"/>, elevation: 0}, {body: () => <IconButton icon="plus"/>, elevation: 0}]}
            style={{ height: 0 }}
            contentContainerStyle={{ paddingVertical: 10, height: 200  }}
            contentInsetAdjustmentBehavior="never"
            snapToAlignment="center"
            decelerationRate="fast"
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={2}
            renderItem={RenderCard}
            snapToInterval={boxWidth}
            contentInset={{
              left: -halfBoxDistance,
              right: halfBoxDistance,
            }}
            contentOffset={{ x: halfBoxDistance * -1, y: 0 }}
            onLayout={(e) => {
              setScrollViewWidth(e.nativeEvent.layout.width);
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: pan.x } } }],
              {
                useNativeDriver: false,
              },
            )}
            keyExtractor={(item, index) => `${index}-${item}`}/>
            <ScrollView>
                {parkingList.map(parking => 
                    <List.Item left={(props) => <List.Icon icon="parking" {...props}/>} right={() => <ParkingButtons {...{active: parking.Active, id: parking.id}}/>} title={parking.Address} description={`${parking.Zip}, ${parking.City}`}/>
                )}
                <Divider leftInset={true}/>
                <TouchableOpacity onPress={() => {resetAddForm();setDialog({...openDialog, add: true})}}>
                    <List.Item right={() => <IconButton icon="plus"/>} title="Add Parking"/>
                </TouchableOpacity>
            </ScrollView>

            <View style={{position: "absolute", bottom: 20, right: 20}}>
                <IconButton
                    icon="plus"
                    mode="contained"
                    style={styles.addButton}
                    onPress={() => {resetAddForm();setDialog({...openDialog, add: true})}}
                />
            </View>

            <AddDialog/>

            <EditDialog/>

            <DeleteDialog/>
        </View>
    );
}

export default Parking;