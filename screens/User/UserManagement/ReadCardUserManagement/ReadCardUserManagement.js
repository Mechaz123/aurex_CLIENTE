import { useEffect, useState } from "react";
import useNFCScanner from "../../../../hooks/useNFCScanner";
import Utils from "../../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import colors from "../../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";

const ReadCardUserManagement = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const { scanNFC } = useNFCScanner();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        leerDatos();
        return (() => {
            ID = undefined;
            setLoading(false);
        })
    }, [route.params]);

    const leerDatos = async () => {
        setLoading(true);
        const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`);

        if (response.Success) {
            setLoading(false);
            const usuarioData = response.Data;
            const { tagCard, errorCard } = await scanNFC(15000);

            if (errorCard == null) {
                if (tagCard != null) {
                    setLoading(true);
                    const jsonData = await Utils.ConvertNfcToJson(tagCard);
                    
                    if (usuarioData.id == Number(jsonData.id) && usuarioData.clave == jsonData.clave) {
                        setLoading(false);
                        Alert.alert("EXITO ✅", "Su tarjeta está configurada correctamente.");
                        navigation.replace("Menu");
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "La tarjeta no se encuentra configurada correctamente, por favor escriba los datos en la tarjeta.");
                        navigation.replace("Menu");
                    }
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "No se ha detectado ningun tag en la tarjeta.");
                    navigation.replace("Menu");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se ha podido detectar la tarjeta.");
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
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para verificar si está correctamente configurada.</Text>
        </View>
    )
}

export default ReadCardUserManagement;