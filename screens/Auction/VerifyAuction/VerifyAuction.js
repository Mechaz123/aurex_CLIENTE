import { useEffect, useState } from "react";
import useNFCScanner from "../../../hooks/useNFCScanner";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";

const VerifyAuction = ({ navigation, route }) => {
    let data = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const { scanNFC } = useNFCScanner();

    useEffect(() => {
        cargarVendedor();
        return (() => {
            data = undefined;
            setLoading(false);
        });
    }, [route.params])

    const cargarVendedor = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${data.producto.id}`);

            if (response.Success) {
                setLoading(false);
                await leerDatos(response.Data.propietario.id, response.Data.propietario.clave);
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
                await crearSubasta();
            } else {
                Alert.alert("ERROR ❌", "No se pudo verificar su identidad, por lo cual no se pudo verificar la subasta.");
                navigation.replace("Menu");
            }
        } else {
            Alert.alert("ERROR ❌", "No se pudo verificar su identidad, por lo cual no se pudo crear la subasta.");
            navigation.replace("Menu");
        }
    }

    const crearSubasta = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `subasta`, data);

            if (response.Success) {
                setLoading(false);
                Alert.alert("EXITO ✅", "La subasta fue creada.");
                navigation.replace("Menu");
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo realizar el registro de la subasta.");
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
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para verificar la creación de la subasta.</Text>
        </View>
    )
}

export default VerifyAuction;