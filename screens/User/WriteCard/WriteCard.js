import React, { useEffect } from "react";
import useNFCWritter from "../../../hooks/useNFCWritter";
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';

const WriteCard = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const { writeNFC } = useNFCWritter();

    useEffect(() => {
        escribirDatos();
        return (() => {
            ID = undefined;
        })
    }, [route.params]);

    const escribirDatos = async () => {
        const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`);

        if (response.Success) {
            const jsonDATA = {
                "id": response.Data.id,
                "clave": response.Data.clave
            }

            const errorWriteCard = await writeNFC(jsonDATA, 30000);

            if (errorWriteCard == null) {
                const dataMensajeTerminosYCondiciones = {
                    "to": response.Data.correo,
                    "subject": "TERMINOS Y CONDICIONES DE AUREX"
                }
                const dataMensajeUsuarioRegistrado = {
                    "to": response.Data.correo,
                    "subject": "USUARIO REGISTRADO EN AUREX",
                    "content": {
                        "nombre_usuario": response.Data.nombre_usuario
                    }
                }

                const responseTerminosYCondiciones = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `email/enviar`, dataMensajeTerminosYCondiciones);
                const responseUsuarioRegistrado = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `email/enviar`, dataMensajeUsuarioRegistrado);

                if (responseTerminosYCondiciones.Success && responseUsuarioRegistrado.Success) {
                    Alert.alert("EXITO ✅", "Su tarjeta fue configurada correctamente y se ha enviado los mensajes al correo registrado.");
                    navigation.replace("Login");
                } else {
                    setBotonActivo(false);
                    Alert.alert("ERROR ❌", "Error su tarjeta no pudo ser configurada, por favor intente de nuevo.");
                }
            } else {
                setBotonActivo(false);
                Alert.alert("ERROR ❌", "Error su tarjeta no pudo ser configurada, por favor intente de nuevo.");
            }
        } else {
            Alert.alert("ERROR ❌", "No se pudo cargar la data del usuario.");
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para que sea configurada.</Text>
        </View>
    )
}

export default WriteCard;