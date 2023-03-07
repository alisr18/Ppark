import {StatusBar, Text, View, StyleSheet, TextInput, Button, TextInputBase} from "react-native";
import React, {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebaseConfig";



const Login = ({setUser}) => {
    // Component state, mirrors the input fields
    const [epost, setEpost] = useState("test@uia.no");
    const [password, setPassword] = useState("123456");

    // Logs in the user based on the value of the component state.
    // This function is called when the button declared below is pressed.
    const loginUser = () => {
        signInWithEmailAndPassword(auth, epost, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`User has been signed in: ${user.email}`);

                // Call the setter passed to us as a prop
                setUser(user);
            })
            .catch((error) => {
                console.log(`Error: ${error.code} ${error.message}`);
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <View style={{marginTop: 50}}>
            <Text>Username:</Text>
            <TextInput
                onChangeText={setEpost}
                keyboardType="email-address"
                defaultValue="test@uia.no"
            />

            <Text>Password:</Text>
            <TextInput
                onChangeText={setPassword}
                secureTextEntry={true}
                defaultValue="123456"
            />

            <Button
                onPress={loginUser}
                title="Log in"
            />
        </View>
    );
}


export default Login;