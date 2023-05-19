import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../authContext";
import { IconButton } from "react-native-paper";
import {collection, query, where, getDocs, orderBy} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { List } from 'react-native-paper';

const History = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigation();
    const [data, setData] = useState([]);
    const [dataA, setDataa] = useState([]);
    useEffect(() => {
        fetchHistoryData();
    }, []);

    const fetchHistoryData = async () => {
        try {
            const userId = user.uid;
            const renterQuery = query(
                collection(db, "orders"),
                where("renter", "==", userId),
                orderBy("endDate", "desc")
            );

            const ownerQuery = query(
                collection(db, "orders"),
                where("owner", "==", userId),
            );


            const renterSnapshot = await getDocs(renterQuery);
            const ownerSnapshot = await getDocs(ownerQuery);

            const fetchedRenterData = renterSnapshot.docs.map((doc) => ({
                price: doc.data().price,
                ed: doc.data().endDate.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                address: doc.data().address,
                car: doc.data().car,
                owner: doc.data().owner
            }));

            const fetchedOwnerData = ownerSnapshot.docs.map((doc) => ({
                price: doc.data().price,
                ed: doc.data().endDate.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                address: doc.data().address,
                car: doc.data().car,
                owner: doc.data().owner
            }));


            setData(fetchedRenterData);
            setDataa(fetchedOwnerData);
        } catch (error) {
            console.error("Error fetching history data: ", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <IconButton
                    style={styles.backButton}
                    icon="arrow-left"
                    onPress={navigate.goBack}
                />
                <Text style={styles.title}>History</Text>
            </View>
            {data.length === 0 ? (
                <Text style={styles.noDataText}>No history data available</Text>
            ) : (
                <List.Section>
                    {data.map((item, index) => (
                        <List.Item
                            left={(props) => <List.Icon
                                icon={item.owner == user.uid? "parking" : "car"}
                                {...props}
                            />}
                            key={index}
                            title={`Address: ${item.address}`}
                            description={`Car: ${item.car}, Date Ended: ${item.ed},\n${
                                item.owner === user.uid ? "Earned: " + item.price + " NOK" : "Paid: " + item.price + " NOK"
                            }`}
                        />
                    ))}
                </List.Section>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    noDataText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
    listItem: {
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
        backgroundColor: "#f9f9f9",
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    listItemDescription: {
        fontSize: 14,
        color: "#888",
    },
});

export default History;
