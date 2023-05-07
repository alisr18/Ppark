import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import {Button, Text, TextInput, Portal, Dialog, IconButton} from "react-native-paper";
import { AuthContext } from "../authContext";
import { useForm } from "react-hook-form";
import { Input } from "../components/Input";


const Login = () => {
    // Component state, mirrors the input fields
<<<<<<< HEAD
    const [email, setEmail] = useState(''); // testusername: test@uia.no, testpassword: 123456
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login, resetPassword } = useContext(AuthContext);

    const [resetDialog, setResetDialog] = useState(false);
    const { control: resetForm, handleSubmit: handleReset, reset: resetResetForm } = useForm();

    function ResetPasswordDialog() {
        return (
            <Portal>
                <Dialog visible={resetDialog} onDismiss={() => setResetDialog(false)}>
                    <IconButton
                        icon="close"
                        onPress={() => setResetDialog(false)}
                        size={20}
                        style={{ position: 'absolute', top: 0, left: 0, margin: 10 }}
                    />
                    <Dialog.Title style={{ marginLeft: 40 }}>
                        Reset Password
                    </Dialog.Title>
                    <Dialog.Content>
                        <Input control={resetForm} rules={{required: true}} name="email" label="Email" style={styles.dialogInput}/>
                        <Button mode='contained' value="submit" onPress={handleReset(async (p) => {
                            try {
                                await resetPassword(p.email);
                                setResetDialog(false)
                            } catch (error) {
                                alert("Please provide a valid account email");
                            }
                        })}>Send Email</Button>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        )
    }
=======
    const [email, setEmail] = useState('test@uia.no'); // testusername: test@uia.no, testpassword: 123456
    const [password, setPassword] = useState('123456');
    const { login } = useContext(AuthContext);
>>>>>>> 670226b (Autoplace, current position and mapViewdirection)

    // Logs in the user based on the value of the component state.
    // This function is called when the button declared below is pressed.

    const resetErrorMessage = () => {
        setErrorMessage('');
    };
    const loginUser = async () => {
        resetErrorMessage();
        try {
            await login(email, password);
        } catch (error) {
            setErrorMessage("Invalid email or password");
        }
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
                disabled={!email || !password}
                marginTop={10}
            >
            Login
            </Button>

            {errorMessage ? <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text> : null}

            <TouchableOpacity style={{marginTop: 25}} onPress={() => {resetResetForm(); setResetDialog(true)}}>
                <Text>Forgotten your password?</Text>
            </TouchableOpacity>

            <ResetPasswordDialog/>
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
    dialogInput: {
        marginBottom: 10
    },
});


export default Login;