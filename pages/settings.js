import { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text, List, ToggleButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { SelectedThemeContext, ThemeContext } from "../App";


function Settings() {

    const theme = useContext(ThemeContext)

    const themeSelect = useContext(SelectedThemeContext)
    
    const navigate = useNavigation();

    const [value, setValue] = useState(themeSelect.storedTheme)
    
    
    const changeTheme = async (value) => {
        if (value){
            themeSelect.setStoredTheme(value)
            setValue(value)
        }
    }

    
    const styles = StyleSheet.create({
        page: {
            flex: 1,
        },
        close: {
            alignSelf: "flex-start",
            marginTop: 25,
        },
        headline: {
            fontSize: 30,
            margin: 30
        },
        list: {
        },
        button: {
            borderWidth: 2,
            borderColor: theme.colors.surfaceVariant
        },
    })
    
    return (
        <View style={styles.page}>
            <IconButton 
                style={styles.close} 
                onPress={navigate.goBack}
                icon="arrow-left"
                mode="contained-tonal" 
            />
            <View style={{alignItems: "center"}}>
                <Text style={styles.headline}>Settings</Text>
            </View>
            <List.Item style={styles.list} 
                title="Application Theme"
                description="Switch between dark and light mode"
                right={() => (
                    <ToggleButton.Row onValueChange={value => changeTheme(value)} value={value}>
                        <ToggleButton theme={{...theme, roundness: 20}}  style={styles.button} icon="theme-light-dark" value="auto" iconColor={(value === "auto") ? theme.colors.primary : theme.colors.onSurfaceVariant}/>
                        <ToggleButton style={styles.button} icon="weather-sunny" value="light" iconColor={(value === "light") ? theme.colors.primary : theme.colors.onSurfaceVariant}/>
                        <ToggleButton theme={{...theme, roundness: 20}}  style={styles.button} icon="weather-night" value="dark" iconColor={(value === "dark") ? theme.colors.primary : theme.colors.onSurfaceVariant} />
                    </ToggleButton.Row>
                )}
            />
            <List.Item title="Second Item"/>
        </View>
    );
}

export default Settings;