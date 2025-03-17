import { useEffect, useState } from "react";
import Authentication from "../../../../services/Authentication";
import Utils from "../../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import colors from "../../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import useNFCScanner from "../../../../hooks/useNFCScanner";

const VerifyPurchase = ({ navigation, route }) => {
    let { idProducto, cantidad, totalPago } = route.params ?? {};
    const [loading, setLoading] = useState(false);

    const { scanNFC } = useNFCScanner();

    useEffect(() => {
        cargarComprador();
        return (() => {
            idProducto = undefined;
            cantidad = undefined;
            totalPago = undefined;
            setLoading(false);
        });
    }, [route.params])

    const cargarComprador = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const idUsuario = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${idUsuario}`);

            if (response.Success) {
                setLoading(false);
                await leerDatos(response.Data.id, response.Data.clave);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar la información del comprador.");
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
                await generarCompraUsuario();
            } else {
                Alert.alert("ERROR ❌", "No se pudo verificar su identidad, por lo cual no se pudo verificar la compra.");
                navigation.replace("Menu");
            }
        } else {
            Alert.alert("ERROR ❌", "No se pudo verificar su identidad, por lo cual no se pudo verificar la compra.");
            navigation.replace("Menu");
        }
    }

    const generarCompraUsuario = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const idUsuario = await AsyncStorage.getItem('usuarioId');
            const data = {
                "idUsuario": idUsuario,
                "idProducto": idProducto,
                "cantidad": cantidad,
                "totalPago": totalPago,
            }

            const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `pedido/crear_compra`, data);
            
            if (response.Success) {
                setLoading(false);
                Alert.alert("EXITO ✅", "La compra fue realizada, por favor esperar confirmación del vendedor, la información llegará mediante su correo de su correo.");
                navigation.replace("Menu");
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo realizar la compra del producto.");
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
            <Text style={styles.text}>Por favor acerque su tarjeta al dispositivo, para verificar la compra del producto.</Text>
        </View>
    )
}

export default VerifyPurchase;