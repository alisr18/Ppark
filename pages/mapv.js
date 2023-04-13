import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, TextInput } from 'react-native';

const Mapv = () => {
    return (
        <View style={styles.container}>
            <MapView loadingEnabled={true} style={styles.map} />
            <View style={{ position: 'absolute', top: 10, width: '100%' }}>
                <TextInput
                    style={styles.searchbar}
                    placeholder={'Search'}
                    placeholderTextColor={'#000'}
                />
            </View>
        </View>
    );
}

export default Mapv;





const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    searchbar:{
        borderRadius: 10,
        margin: 10,
        color: '#000',
        borderColor: '#666',
        backgroundColor: '#FFF',
        borderWidth: 1,
        height: 45,
        paddingHorizontal: 10,
        fontSize: 18,
    }
});
