import React, { useEffect, useState } from "react"
import { Alert, Text, TextInput, View } from "react-native";
import styles from "./styles";
import CustomButton from "../../components/CustomButton/CustomButton";
import nfcManager from "react-native-nfc-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [soportado, setSoportado] = useState(false);
    const [habilitado, setHabilitado] = useState(false);

    useEffect(() => {
        verificarTokenGuardado();
        nfcManager.start();
        requerimientos();
        return (() => {
            nfcManager.close();
            setLoading(false);
            setNombreUsuario('');
            setSoportado(false);
            setHabilitado(false);
        });
    }, []);

    const requerimientos = async () => {
        const estaSoportado = await nfcManager.isSupported();
        const estaHabilitado = await nfcManager.isEnabled();
        setSoportado(estaSoportado);
        setHabilitado(estaHabilitado);
        setLoading(false);
    }

    const verificarTokenGuardado = async () => {
        setLoading(true);

        const token = await AsyncStorage.getItem('autenticacionToken');
        try {
            if (token) {
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/verificar_autenticacion`);
                if (response.Data.valido) {
                    setLoading(false);
                    navigation.replace('Menu');
                } else {
                    await AsyncStorage.removeItem('autenticacionToken');
                    await AsyncStorage.removeItem('usuarioId');
                    setLoading(false);
                }
            }
        } catch (error) {
            await AsyncStorage.removeItem('autenticacionToken');
            await AsyncStorage.removeItem('usuarioId');
            setLoading(false);
        }
    }

    const inicioSesion = () => {
        setLoading(true);

        if (nombreUsuario) {
            if (soportado && habilitado) {
                setLoading(false);
                navigation.replace('NFCAuthentication', { nombreUsuario });
            } else if (!soportado) {
                setLoading(false);
                Alert.alert("ERROR ❌", `Su dispositivo no tiene tecnología NFC.`);
            } else if (!habilitado) {
                setLoading(false);
                Alert.alert('ADVERTENCIA ⚠️', `Por favor encienda la tecnología NFC de su dispositivo un reinicie la aplicación.`)
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", `Por favor ingrese su nombre de usuario`);
        }
    };

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>AUREX</Text>
            <TextInput style={styles.input} placeholder="Nombre de usuario" placeholderTextColor={colors.menu_inactive_option} value={nombreUsuario} onChangeText={setNombreUsuario} />
            <CustomButton title="Iniciar Sesión" onPress={inicioSesion} />
        </View>
    );
};

export default LoginScreen;