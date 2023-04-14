import { View, StyleSheet, Image } from "react-native";
import React, { useContext, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { AuthContext } from "../authContext";


const Login = () => {
    // Component state, mirrors the input fields
    const [email, setEmail] = useState(''); // testusername: test@uia.no, testpassword: 123456
    const [password, setPassword] = useState(''); 
    const { login } = useContext(AuthContext);

    // Logs in the user based on the value of the component state.
    // This function is called when the button declared below is pressed.
    const loginUser = () => {
        login(email, password);
    }

    return (
        <View style={styles.container}>
        <Image source={require("../icons/logo_light.png")} style={styles.logo}/>
        <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.login_field}
        />
        <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            style={styles.login_field}
        />
        <Button 
            icon="login" 
            mode="contained" 
            onPress={loginUser} 
            //buttonColor="#357266" 
            //textColor='#D0DCD4'
            marginTop={10}
        >
        Login
        </Button>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#0E3B43',
        alignItems: 'center',
        justifyContent: 'center',
    },
    login_field: {
        //backgroundColor: '#D0DCD4',
        width: 250,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});


export default Login;