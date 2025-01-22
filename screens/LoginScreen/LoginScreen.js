import React, { useState } from "react"
import {Text, TextInput, View } from "react-native";
import styles from "./styles";
import CustomButton from "../../components/CustomButton/CustomButton";

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username) {
            navigation.replace('NFCAuthentication', { username });
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