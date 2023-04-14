import { useState, useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import {auth, db} from "../firebaseConfig";
import { Button, TextInput } from "react-native-paper";
import { doc, setDoc} from "firebase/firestore"
import {getFirestore} from "firebase/firestore";
import { AuthContext } from "../authContext";


export default function Register () {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayname, setDisplayname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const { login, register } = useContext(AuthContext);

    const registerPressed = async () => {
        console.log("Register button pressed");

        try {
            await register(email, password, async (user) => {
                console.log(user);
            
                console.log(`User has been registered: ${user.email}`);
    
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayname,
                    firstName,
                    lastName,
                });
                
                signIn();
            });
            
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    const signIn = () => {
        login(email, password);
    }

    return (
      <View style={styles.container}>
        <Image source={require("../icons/logo_light.png")} style={styles.logo}/>

        <TextInput
            mode="outlined"
            label="Displayname"
            value={displayname}
            onChangeText={setDisplayname}
            style={styles.register_field}
        />

        <TextInput
            mode="outlined"
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.register_field}
        />

        <TextInput
            mode="outlined"
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.register_field}
        />

        <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.register_field}
        />

        <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            style={styles.register_field}
        />
        <Button 
            icon="account-plus" 
            mode="contained" 
            onPress={registerPressed} 
            //buttonColor="#357266" 
            //textColor='#D0DCD4'
            marginTop={10}
        >
        Register
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
    register_field: {
        //backgroundColor: '#D0DCD4',
        width: 250,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});