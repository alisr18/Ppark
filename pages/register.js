import { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {auth, db} from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Button, TextInput } from "react-native-paper";
import { doc, setDoc} from "firebase/firestore"
import {getFirestore} from "firebase/firestore";


export default function Register ({setUser}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayname, setDisplayname] = useState('');

    const registerPressed = async () => {
        console.log("Register button pressed");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(`User has been registered: ${user.email}`);

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayname,
            });

            signIn();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }



    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`User signed in: ${user.email}`);
                
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

    const alreadyUser = () => {
        console.log('alreadyUser pressed');
        setUser(1);
    }

    return (
      <View style={styles.container}>
        <Image source={require("../icons/logo_light.png")} style={styles.logo}/>

          <TextInput
              mode="outlined"
              label="displayname"
              value={displayname}
              onChangeText={setDisplayname}
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
            icon="login" 
            mode="contained" 
            onPress={registerPressed} 
            //buttonColor="#357266" 
            //textColor='#D0DCD4'
            marginTop={10}
        >
        Register
        </Button>
        <Button
            onPress={alreadyUser}
        >
            Already have a user? Log in here!
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