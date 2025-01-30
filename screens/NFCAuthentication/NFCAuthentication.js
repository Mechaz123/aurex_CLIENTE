import React, { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import styles from './styles';
import CustomButton from '../../components/CustomButton/CustomButton';
import useNFCScanner from '../../hooks/useNFCScanner';
import utils from '../../services/Utils';
import { AUREX_CLIENTE_AUREX_MID_URL} from 'react-native-dotenv';

const NFCAuthentication = ({ navigation, route }) => {
    const { username } = route.params;
    const { tag, error, scanNFC } = useNFCScanner(10000);

    useEffect(() => {
        scanNFC();
    }, [scanNFC]);

    useEffect(() => {
        if (error != null) {
            Alert.alert('Error', error);
            navigation.replace('Login');
        } else if (tag != null) {
            sendAuthentication();
        }
    }, [error, tag, navigation]);

    const sendAuthentication = async () => {
        let jsonData = utils.ConvertNfcToJson(tag);
        jsonData.username = username;
        const userData = await utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `/user/authentication`, jsonData);
        if (userData.Data){
            navigation.replace('Home')
        } else {
            Alert.alert("Error:", "The user or card are invalid.");
            navigation.replace('Login');
        }
    }

    const handleCancel = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Hi, {username}!</Text>
            <Text style={styles.text}>Please swipe your card to log in.</Text>
            <CustomButton title="Cancel" onPress={handleCancel} />
        </View>
    );
}

export default NFCAuthentication;