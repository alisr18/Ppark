import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../authContext";
import { IconButton } from "react-native-paper";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const History = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigation();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchHistoryData();
    }, []);

    const fetchHistoryData = async () => {
        try {
            const userId = user.uid;
            const q = query(collection(db, "orders"), where("renter", "==", userId));
            const snapshot = await getDocs(q);

            const fetchedData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Error fetching history data: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.columnHeader}>Column 1</Text>
                <Text style={styles.columnHeader}>Column 2</Text>
                <Text style={styles.columnHeader}>Column 3</Text>
            </View>
            <View style={styles.body}>
                {data.length === 0 ? (
                    <Text>No history data available</Text>
                ) : (
                    data.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.cell}>{item.column1}</Text>
                            <Text style={styles.cell}>{item.column2}</Text>
                            <Text style={styles.cell}>{item.column3}</Text>
                        </View>
                    ))
                )}
            </View>
            <IconButton
                style={styles.close}
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        backgroundColor: "lightgray",
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    columnHeader: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
    },
    body: {
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        paddingVertical: 5,
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
    close: {
        alignSelf: "flex-start",
        marginTop: 25,
    },
});

export default History;
