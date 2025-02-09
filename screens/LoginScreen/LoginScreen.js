import React, { useEffect, useState } from "react"
import { Alert, Text, TextInput, View } from "react-native";
import styles from "./styles";
import CustomButton from "../../components/CustomButton/CustomButton";
import nfcManager from "react-native-nfc-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../styles/colors";

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [supported, setSupported] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        verifyStoredToken();
        nfcManager.start();
        requirements();
        return (() => {
            nfcManager.close();
        });
    }, []);

    const requirements = async () => {
        const isSupported = await nfcManager.isSupported();
        const isEnabled = await nfcManager.isEnabled();
        setSupported(isSupported);
        setEnabled(isEnabled);
    }

    const verifyStoredToken = async () => {
        const token = await AsyncStorage.getItem('authToken');

        try {
            if (token != null) {
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `user/verify_authentication`);
                if (response.Data.valid) {
                    navigation.replace('Menu');
                } else {
                    await AsyncStorage.removeItem('authToken');
                    await AsyncStorage.removeItem('userId');
                }
            }
        } catch (error) {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userId');
        }
    }

    const handleLogin = () => {
        if (username) {
            if (supported && enabled) {
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
            <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.menu_inactive_option} value={username} onChangeText={setUsername} />
            <CustomButton title="Log in" onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;