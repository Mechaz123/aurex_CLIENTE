import React, { useEffect, useState } from "react"
import {Alert, Text, TextInput, View } from "react-native";
import styles from "./styles";
import CustomButton from "../../components/CustomButton/CustomButton";
import nfcManager from "react-native-nfc-manager";



const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [supported, setSupported] = useState(false);
    const [enabled, setEnabled] = useState(false);

    const requirements = async () => {
        const isSupported = await nfcManager.isSupported();
        const isEnabled = await nfcManager.isEnabled();
        setSupported(isSupported);
        setEnabled(isEnabled);
    }

    useEffect(() => {
        nfcManager.start();
        requirements();
        return (() => {
            nfcManager.close();
        });
    },[]);

    
    const handleLogin = () => {
        if (username) {
            if (supported && enabled){
                navigation.replace('NFCAuthentication', { username });
            } else if (!supported) {
                Alert.alert("Error", `Your phone don't have NFC technology.`);
            } else if (!enabled) {
                Alert.alert('Warning', `Please turn on your phone's NFC technology and restart the app.`)
            }
        } else {
            alert('Please enter your username.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AUREX</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}/>
            <CustomButton title="Log in" onPress={handleLogin}/>
        </View>
    );
};

export default LoginScreen;