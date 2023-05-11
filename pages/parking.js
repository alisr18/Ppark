import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, FlatList, Animated } from "react-native";
import { Button, TextInput, Avatar, Text, IconButton, Menu, List, Dialog, Appbar, Surface, Divider, FAB, RadioButton } from "react-native-paper";
import { ThemeContext } from "../App";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDoc, collection, doc, getDoc, getDocs, where, setDoc, updateDoc, query, deleteDoc, GeoPoint, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Controller, FormProvider, useController, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { geohashForLocation, geohashQueryBounds } from "geofire-common";
import Geocoder from 'react-native-geocoding';
import { DatePickerModal } from 'react-native-paper-dates';
import {googleapikey} from '@env'
import * as geofire from "geofire-common";

Geocoder.init(googleapikey);

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
            delete: false,
            session: false,
            selectP: false,
            date_picker: false
        }
    )

    const {control: addForm, handleSubmit: handleAdd, reset: resetAddForm} = useForm()

    const {control: editForm, handleSubmit: handleEdit, reset: setEditForm} = useForm()

    const {control: sessionForm, handleSubmit: handleSession, watch: watchSession, reset: setSessionForm, setValue: updateSession} = useForm()

    const [parkingList, setParkingList] = useState([])

    const [parkingID, setparkingID] = useState("")

    const [loading, setLoading] = useState(false)
    
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

    const center = Geocoder.from("Edvard Greigs Vei 28, 4023, Stavanger")
    .then(json => json.results[0].geometry.location)
    .catch(error => console.warn(error));
    const radius = 10 * 1000

    const addParkingSession = async (parking) => {
        setLoading(true)
        const geohash = Geocoder.from(`${parking.Address}, ${parking.Zip}, ${parking.City}`)
        addDoc(collection(db, "parking_session"), {
            geohash: geohash,
            price: parking.price,
            start_time: parking.start,
            end_time: parking.end,
            active: true,
            uid: user.uid

        })
            .then(() => {
                updateParking()
                setDialog({...openDialog, add: false})
                setLoading(false)
            })
            .catch(error => console.log(error))
    }





    const testSession = () => {
        addParkingSession({
            Address: "Jon Lilletuns vei 9",
            Zip: 4879,
            City: "Grimstad",
            price: 200,
            start_time: new Date().setHours(12),
            stop_time: new Date().setHours(12)
        })
    }


    const addParking = async (parking) => {
        setLoading(true)
        parking.uid = user.uid
        addDoc(collection(db, "parking"), parking)
            .then(() => {
                updateParking()
                setDialog({...openDialog, add: false})
                setLoading(false)
            })
            .catch(error => console.log(error))
    }

    const delParking = async (id) => {
        setLoading(true)
        deleteDoc(doc(db, "parking", id)).then(() => {
            updateParking()
            setDialog({...openDialog, delete: false})
            setLoading(false)
        }).catch(error => {
            console.log(error)
            setLoading(false)
        })
    }

    const openEdit = async (id) => {
        let parking = await getParkingDetail(id)
        setEditForm(parking)
        setDialog({...openDialog, edit: true})
    }
    
    const openDelete = async (id) => {
        setparkingID(id)
        setDialog({...openDialog, delete: true})
    }
    
    const openSession = async (id) => {
        if (id != "") updateSession("parkingID", id)
        setDialog({...openDialog, session: true})
    }



    const addParkings = async (parking) => {
        setLoading(true)
        try {
            const { latitude, longitude } = await getCoordinates(parking.Address, parking.Zip, parking.City)
            const hash = geofire.geohashForLocation([latitude, longitude]);


            const newParking = {
                ...parking,
                geohash: hash,
                latitude,
                longitude,
                uid: user.uid,
                active: true,
            }
            await addDoc(collection(db, "parking"), newParking)
            updateParking()
            setDialog({ ...openDialog, add: false })
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    const getCoordinates = async (address, zip, city) => {
        const response = await Geocoder.from(`${address}, ${zip}, ${city}`)
        const { lat, lng } = response.results[0].geometry.location
        console.log(lat, lng)

        return new GeoPoint(lat, lng)
    }









    function ParkingButtons(props) {
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <IconButton icon="delete" backgroundColor={theme.colors.errorContainer} iconColor={theme.colors.onErrorContainer} onPress={() => openDelete(props.id)}/>
                <Button mode="contained" buttonColor={theme.colors.tertiaryContainer} textColor={theme.colors.onTertiaryContainer} onPress={() => openEdit(props.id)}>Edit</Button>
                <IconButton icon={props.active ?? false ? "pause" : "play"} backgroundColor={theme.colors.primary} iconColor={theme.colors.onPrimary} onPress={() => openSession(props.id)}/>
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
                    <Button loading={loading} mode='contained' value="submit"  onPress={handleAdd(p => addParkings(p))}>Create</Button>
                </Dialog.Actions>
            </Dialog>
        )
    }

    function SelectParking() {
        return (
            <Dialog visible={openDialog.selectP} onDismiss={() => setDialog({...openDialog, selectP: false})}>
                <Dialog.Title>Choose a parking spot</Dialog.Title>
                <Dialog.Content>
                    <Controller
                    control={sessionForm}
                    name="parkingID"
                    render={({ field: { onChange, value } }) => (
                        <RadioButton.Group onValueChange={onChange} value={value}>
                            {
                                parkingList.map(park => (
                                    <View>
                                        <RadioButton.Item label={park.Address} value={park.id} />
                                    </View>
                                ))
                            }
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

    function SessionDialog() {
        return (
            <Dialog visible={openDialog.session} onDismiss={() => setDialog({...openDialog, session: false})}>
                <Dialog.Title>Start Parking Session</Dialog.Title>
                <Dialog.Content>
                        <Button onPress={() => setDialog({...openDialog, selectP: true})}>Select Parking Address</Button>
                        <Input control={sessionForm} rules={{required: true, valueAsNumber: true}} name="Price" label="Price" style={styles.dialogInput}/>
                        <Button onPress={() => setDialog({...openDialog, date_picker: true})} uppercase={false} mode="outlined">
                            {watchSession("date")?.toString()}
                        </Button>
                        <Controller
                        control={sessionForm}
                        name="date"
                        locale="en"
                        defaultValue={new Date()}
                        validRange={{startDate: new Date()}}
                        render={({field: {value, onChange}}) => (
                            <DatePickerModal
                            mode="single"
                            visible={openDialog.date_picker}
                            onDismiss={() => setDialog({...openDialog, date_picker: false})}
                            date={value}
                            onConfirm={(date) => {
                                date instanceof Date ? 
                                    onChange(date)
                                 : {}
                        }}
                            />
                        )}
                        />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, session: false})}>Cancel</Button>
                    <Button loading={loading} mode='contained' value="submit" onPress={handleAdd(p => addParking(p, user))}>Create</Button>
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
                        <Button loading={loading} mode='contained' value="submit" onPress={handleEdit(handleEditSubmit)}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
        )
    }

    function DeleteDialog() {
        return (
            <Dialog visible={openDialog.delete} onDismiss={() => setDialog({...openDialog, delete: false})}>
                <Dialog.Title>Delete Parking Spot</Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to delete this parking spot?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog({...openDialog, delete: false})}>Cancel</Button>
                    <Button loading={loading} textColor={theme.colors.error} onPress={() => delParking(parkingID)}>Delete</Button>
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
            marginLeft: 20,
            fontSize: 14,
            color: theme.colors.primary,
        },
        carPlate: {
            fontSize: 20,
            color: theme.colors.outline,
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
              <Surface style={styles.carContainer} elevation={3}>
                  <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                      <View style={{maxWidth: 500}}>
                          <Text numberOfLines={1} style={styles.carName}>Gatenavn dwqwqfewf  123</Text>
                          <Text style={styles.carPlate}>Until 18:00</Text>
                      </View>
                        <Text style={styles.carStatus}>Active</Text>
                  </View>
                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
                      <Text style={{...styles.carPlate, justifyContent: "flex-end"}}>56kr per hour</Text>
                      <Button style={{width: 90}} mode="contained" onPress={() => console.log("Stop pressed")}>Stop</Button>
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
            <View>
                
            <FlatList
            horizontal
            data={[{body: () => <Text>Yo</Text>, elevation: 3}, {body: () => <IconButton icon="plus"/>, elevation: 0}, {body: () => <IconButton icon="plus"/>, elevation: 0}, {body: () => <IconButton icon="plus"/>, elevation: 0}]}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 25  }}
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
            </View>
            <ScrollView style={{paddingBottom: 100}}>
                {parkingList.length ? parkingList.map(parking => 
                    <List.Item left={(props) => <List.Icon icon="parking" {...props}/>} right={() => <ParkingButtons {...{active: parking.Active, id: parking.id}}/>} title={parking.Address} description={`${parking.Zip}, ${parking.City}`}/>
                ) : 
                <TouchableOpacity onPress={() => {resetAddForm();setDialog({...openDialog, add: true})}}>
                    <List.Item right={() => <IconButton icon="plus"/>} title="Add Parking"/>
                </TouchableOpacity>}
                <Divider leftInset={true}/>
                <View style={{height: 100}}>

                </View>
            </ScrollView>

            <View style={{position: "absolute", bottom: 15, right: 15}}>
                <FAB
                    icon="plus"
                    onPress={() => {resetAddForm();setDialog({...openDialog, add: true})}}
                />
            </View>

            <AddDialog/>

            <EditDialog/>

            <DeleteDialog/>

            <SessionDialog/>

            <SelectParking/>
        </View>
    );
}

export default Parking;