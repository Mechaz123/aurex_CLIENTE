import React, { useEffect, useState } from "react";
import useNFCWritter from "../../../hooks/useNFCWritter";
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";

const WriteCard = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const { writeNFC } = useNFCWritter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        escribirDatos();
        return (() => {
            ID = undefined;
            setLoading(false);
        })
    }, [route.params]);

    const escribirDatos = async () => {
        setLoading(true);
        const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`);

        if (response.Success) {
            const jsonDATA = {
                "id": String(response.Data.id),
                "clave": response.Data.clave
            }
            setLoading(false);

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

                setLoading(true);
                const responseTerminosYCondiciones = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `email/enviar`, dataMensajeTerminosYCondiciones);
                const responseUsuarioRegistrado = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `email/enviar`, dataMensajeUsuarioRegistrado);

                if (responseTerminosYCondiciones.Success && responseUsuarioRegistrado.Success) {
                    setLoading(false);
                    Alert.alert("EXITO ✅", "Su tarjeta fue configurada correctamente y se ha enviado los mensajes al correo registrado.");
                    navigation.replace("Menu");
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", `Por favor verificar la tarjeta en el panel de "Gestión de Usuarios", no se pudo enviar los correos al usuario.`);
                    navigation.replace("Menu");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", `Error su tarjeta no pudo ser configurada, por favor intente de nuevo desde el módulo de "Gestión de usuarios", el usuario ya se encuentra creado.`);
                navigation.replace("Menu");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "No se pudo cargar la data del usuario.");
            navigation.replace("Menu");
        }

    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para que sea configurada.</Text>
        </View>
    )
}

export default WriteCard;