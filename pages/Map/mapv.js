import React ,{ useState } from 'react';
import MapView from 'react-native-maps';


const Mapv = () => {

    const theme = useContext(ThemeContext);
    const { active } = useContext(AuthContext);





    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>

            <MapView 
            loadingEnabled={true} 
            style={styles.map} 
            customMapStyle={theme.dark ? theme.map.dark : theme.map.light}
            />
            <View style={{ position: 'absolute', top: 10, width: '100%' }}>
                <TextInput
                mode='outlined'
                    placeholder={'Search'}
                />
            </View>

        </View>
</SafeAreaView>
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

