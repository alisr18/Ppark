import { View, StyleSheet, Image } from "react-native";
import React, {useContext, useState} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Button, TextInput } from "react-native-paper";
import {UserContext} from "../App";



const Login = () => {
    const { user, setUser } = useContext(UserContext);
    // Component state, mirrors the input fields
    const [email, setEmail] = useState('test@uia.no'); // testusername: test@uia.no, testpassword: 123456
    const [password, setPassword] = useState('123456');

    // Logs in the user based on the value of the component state.
    // This function is called when the button declared below is pressed.
    const loginUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`User has been signed in: ${user.email}`);

                // Call the setter passed to us as a prop
                setUser(user);
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.log(`Error: ${error.code} ${error.message}`);
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const newUser = () => {
        console.log('newUser pressed');
        setUser(null);
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
        <Button
            onPress={newUser}
        >
            New user? Register here!
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