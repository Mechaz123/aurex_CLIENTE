import React, { useEffect, useState } from "react";
import useNFCWritter from "../../../hooks/useNFCWritter";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

const WriteCard = ({ navigation }) => {
    const [botonInactivo, setBotonInactivo] = useState(true);
    const { error, writeNFC } = useNFCWritter();

    useEffect(() => {
        escribirDatos();
    }, []);

    const escribirDatos = async () => {
        const jsonDATA = {
            "id": "5",
            "clave": "password"
        }

        await writeNFC(jsonDATA, 10000);
        setBotonInactivo(true);

        if (error == null) {
            Alert.alert("EXITO ✅", "Su tarjeta fue configurada correctamente.");
            navigation.replace("Login");
        } else {
            setBotonActivo(false);
            Alert.alert("ERROR ❌", "Error su tarjeta no pudo ser configurada, por favor intente de nuevo.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para que sea configurada.</Text>
            <TouchableOpacity disabled={botonInactivo} style={styles.button} onPress={escribirDatos}>
                <Text style={styles.text_button}> Intentar de nuevo </Text>
            </TouchableOpacity>
        </View>
    )
}

export default WriteCard;