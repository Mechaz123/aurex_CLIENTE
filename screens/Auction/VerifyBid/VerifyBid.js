import { useEffect, useState } from "react";
import useNFCScanner from "../../../hooks/useNFCScanner";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, Text, View } from "react-native";
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "./styles";

const VerifyBid = ({ navigation, route }) => {
    let data = route.params ?? undefined;
    const [loading, setLoading] = useState(false);
    const { scanNFC } = useNFCScanner();

    useEffect(() => {
        cargarComprador();
        return (() => {
            data = undefined;
            setLoading(false);
        });
    }, [route.params])

    const cargarComprador = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${data.usuario.id}`);

            if (response.Success) {
                setLoading(false);
                await leerDatos(response.Data.id, response.Data.clave);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar la información del usuario.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const leerDatos = async (id, clave) => {
        const { tagCard, errorCard } = await scanNFC(15000);

        if (errorCard == null) {
            const jsonData = await Utils.ConvertNfcToJson(tagCard);

            if (id == Number(jsonData.id) && clave == jsonData.clave) {
                setLoading(true);
                await crearPuja();
            } else {
                Alert.alert("ERROR ❌", "No se pudo verificar su identidad, por lo cual no se pudo verificar la puja.");
                navigation.replace("Menu");
            }
        } else {
            Alert.alert("ERROR ❌", "No se pudo verificar su identidad, por lo cual no se pudo crear la puja.");
            navigation.replace("Menu");
        }
    }

    const crearPuja = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `subasta/registrar_puja`, data);

            if (response.Success) {
                setLoading(false);
                Alert.alert("EXITO ✅", "La puja fue registrada, recuerde revisar constantemente la subasta.");
                navigation.replace("Menu");
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo realizar el registro de la puja.");
                navigation.replace("Menu"); 
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Menu");
        }
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>AUREX</Text>
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para verificar la creación de la puja.</Text>
        </View>
    )
}

export default VerifyBid;