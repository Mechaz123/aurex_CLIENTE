import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import styles from './styles';
import CustomButton from '../../components/CustomButton/CustomButton';
import useNFCScanner from '../../hooks/useNFCScanner';

const NFCAuthentication = ({ navigation, route }) => {
    const { username } = route.params;
    const { isScanning, tag, error, scanNFC } = useNFCScanner(10000);



    const handleCancel = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Hi, {username}!</Text>
            <Text style={styles.text}>Please swipe your card to log in.</Text>
            <Button title={isScanning ? 'Escaneando...' : 'Escanear NFC'} onPress={scanNFC} disabled={isScanning}/>
            {tag && (<View style={{ marginTop: 20 }}><Text>Tag detectado:</Text><Text>{JSON.stringify(tag)}</Text></View>)}
            {error && ( <View style={{ marginTop: 20 }}><Text style={{ color: 'red' }}>{error}</Text></View>)}
            <CustomButton title="Cancel" onPress={handleCancel} />
        </View>
    );
}

export default NFCAuthentication;