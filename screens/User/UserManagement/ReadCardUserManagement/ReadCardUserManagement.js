import { useEffect } from "react";
import useNFCScanner from "../../../../hooks/useNFCScanner";
import Utils from "../../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, Text, View } from "react-native";
import styles from "./styles";

const ReadCardUserManagement = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const { scanNFC } = useNFCScanner();

    useEffect(() => {
        leerDatos();
        return (() => {
            ID = undefined;
        })
    }, [route.params]);

    const leerDatos = async () => {
        const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`);

        if (response.Success) {
            const usuarioData = response.Data;
            const { tagCard, errorCard } = await scanNFC(15000);

            if (errorCard == null) {
                if (tagCard != null) {
                    const jsonData = await Utils.ConvertNfcToJson(tagCard);
                    
                    if (usuarioData.id == Number(jsonData.id) && usuarioData.clave == jsonData.clave) {
                        Alert.alert("EXITO ✅", "Su tarjeta está configurada correctamente.");
                        navigation.replace("Menu");
                    } else {
                        Alert.alert("ERROR ❌", "La tarjeta no se encuentra configurada correctamente, por favor escriba los datos en la tarjeta.");
                        navigation.replace("Menu");
                    }
                } else {
                    Alert.alert("ERROR ❌", "No se ha detectado ningun tag en la tarjeta.");
                    navigation.replace("Menu");
                }
            } else {
                Alert.alert("ERROR ❌", "No se ha podido detectar la tarjeta.");
                navigation.replace("Menu");
            }

        } else {
            Alert.alert("ERROR ❌", "No se pudo cargar la data del usuario.");
            navigation.replace("Menu");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para verificar si está correctamente configurada.</Text>
        </View>
    )
}

export default ReadCardUserManagement;