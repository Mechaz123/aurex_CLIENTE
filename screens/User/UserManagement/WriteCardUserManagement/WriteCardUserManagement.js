import React, { useEffect, useState } from "react";
import useNFCWritter from "../../../../hooks/useNFCWritter";
import Utils from "../../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import colors from "../../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";

const WriteCardUserManagement = ({navigation, route}) => {
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
            setLoading(false);
            const jsonDATA = {
                "id": String(response.Data.id),
                "clave": response.Data.clave
            }

            const errorWriteCard = await writeNFC(jsonDATA, 30000);

            if (errorWriteCard == null) {
                Alert.alert("EXITO ✅", "Su tarjeta fue configurada correctamente, por favor verifique que los datos sean correctos.");
                navigation.replace("Menu");
            } else {
                Alert.alert("ERROR ❌", "Error su tarjeta no pudo ser configurada, por favor intente de nuevo.");
                navigation.replace("Menu");
            }
        } else {
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

export default WriteCardUserManagement;