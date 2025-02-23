import React, { useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import useNFCScanner from '../../hooks/useNFCScanner';
import utils from '../../services/Utils';
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NFCAuthentication = ({ navigation, route }) => {
    const { nombreUsuario } = route.params;
    const { tag, error, scanNFC } = useNFCScanner(10000);

    useEffect(() => {
        scanNFC();
    }, [scanNFC]);

    useEffect(() => {
        if (error != null) {
            Alert.alert('ERROR ❌', error);
            navigation.replace('Login');
        } else if (tag != null) {
            enviarAutenticacion();
        }
    }, [error, tag, navigation]);

    const enviarAutenticacion = async () => {
        let jsonData = utils.ConvertNfcToJson(tag);
        jsonData.nombre_usuario = nombreUsuario;
        const usuarioData = await utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/autenticacion`, jsonData);

        if (usuarioData.Data != null) {
            await guardarToken(usuarioData.Data.token, jsonData.id);
            navigation.replace('Menu');
        } else {
            Alert.alert("ERROR ❌", "El nombre de usuario o la tarjeta son incorrectos.");
            navigation.replace('Login');
        }
    }

    const guardarToken = async (token, id) => {
        try {
            AsyncStorage.setItem('autenticacionToken', token);
            AsyncStorage.setItem('usuarioId', id);
        } catch (error) {
            Alert.alert("ERROR ❌", "Autenticación fallida, por favor intente de nuevo.");
            navigation.replace('Login');
        }
    }

    const Cancelar = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo.</Text>
            <TouchableOpacity style={styles.button} onPress={Cancelar}>
                <Text style={styles.text_button}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default NFCAuthentication;