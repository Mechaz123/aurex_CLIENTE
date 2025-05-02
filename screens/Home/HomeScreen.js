import React, { useCallback, useState } from 'react';
import { Alert, Text, View } from "react-native";
import styles from './styles';
import colors from '../../styles/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import Authentication from '../../services/Authentication';
import Utils from '../../services/Utils';
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [loading, setLoading] = useState(false);
    const [usuarioRoles, setUsuarioRoles] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarUsuarioRoles();
            return (() => {
                setLoading(false);
                setUsuarioRoles([]);
            })
        }, [])
    );

    const cargarUsuarioRoles = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol`);

            if (response.Success) {
                const ID = await AsyncStorage.getItem('usuarioId');
                const data = response.Data;
                const resultado = data.filter(usuario_rol => (usuario_rol.usuario.id == Number(ID)));
                setUsuarioRoles(resultado);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar la data.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>🏠 Inicio</Text>
            <Text style={styles.text}>Señor usuario, usted ha ingresado exitosamente a AUREX, recuerde por favor tener su tarjeta cerca para realizar acciones en el sistema, a continuación se listaran los roles con los cuales usted cuenta actualmente:</Text>
            {usuarioRoles.map((item, index) => (
                <Text key={index} style={styles.item}>- {item.rol.nombre}</Text>
            ))}
        </View>
    );
}

export default HomeScreen;