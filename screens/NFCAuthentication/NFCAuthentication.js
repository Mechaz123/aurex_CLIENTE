import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import useNFCScanner from '../../hooks/useNFCScanner';
import Utils from '../../services/Utils';
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../styles/colors';

const NFCAuthentication = ({ navigation, route }) => {
    const { nombreUsuario } = route.params;
    const { scanNFC } = useNFCScanner();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        leerTarjeta();
        return(() => {
            setLoading(false);
        });
    }, [route.params]);

    const leerTarjeta = async () => {
        const { tagCard, errorCard } = await scanNFC(15000);

        if (errorCard != null) {
            Alert.alert('ERROR ❌', errorCard);
            navigation.replace('Login');
        } else if (tagCard != null) {
            await enviarAutenticacion(tagCard);
        }
    }
    const enviarAutenticacion = async (tag) => {
        setLoading(true);
        let jsonData = await Utils.ConvertNfcToJson(tag);
        jsonData.nombre_usuario = nombreUsuario;
        const usuarioData = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/autenticacion`, jsonData);

        if (usuarioData.Data != null) {
            await guardarToken(usuarioData.Data.token, jsonData.id);
            setLoading(false);
            navigation.replace('Menu');
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "El nombre de usuario o la tarjeta son incorrectos.");
            navigation.replace('Login');
        }
    }

    const guardarToken = async (token, id) => {
        try {
            AsyncStorage.setItem('autenticacionToken', token);
            AsyncStorage.setItem('usuarioId', id);
        } catch (error) {
            setLoading(false);
            Alert.alert("ERROR ❌", "Autenticación fallida, por favor intente de nuevo.");
            navigation.replace('Login');
        }
    }

    const Cancelar = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo.</Text>
            <TouchableOpacity style={styles.button} onPress={Cancelar}>
                <Text style={styles.text_button}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default NFCAuthentication;