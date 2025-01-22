import React, { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import styles from './styles';
import CustomButton from '../../components/CustomButton/CustomButton';
import useNFCScanner from '../../hooks/useNFCScanner';

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
        } else if(tag != null){
            Alert.alert('Tag', JSON.stringify(tag));
            navigation.replace('Login');
        }
    }, [error, tag, navigation]);

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