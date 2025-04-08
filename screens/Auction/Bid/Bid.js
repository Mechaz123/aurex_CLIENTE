import { useEffect, useState } from "react";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import CustomCardDetailProduct from "../../../components/CustomCardDetailProduct/CustomCardDetailProduct";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../../components/CustomButton/CustomButton";

const Bid = ({ navigation, route }) => {
    let subastaId = route.params ?? undefined;
    const [loading, setLoading] = useState(false);
    const [subasta, setSubasta] = useState(null);
    const [comprador, setComprador] = useState(null);
    const [montoPuja, setMontoPuja] = useState(null);

    useEffect(() => {
        cargarSubasta();
        cargarCreditoUsuario();
        return (() => {
            setLoading(false);
            setSubasta(null);
            setComprador(null);
            setMontoPuja(null);
        });
    }, [route.params])

    const cargarSubasta = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `subasta/${subastaId}`);

            if (response.Success) {
                setSubasta(response.Data);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar la información de la subasta.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarCreditoUsuario = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const idUsuario = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `credito/consultar_monto/${idUsuario}`);

            if (response.Success) {
                setComprador(response.Data);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar el saldo del comprador.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const confirmarPuja = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (Number(montoPuja) <= comprador.monto) {
                if (Number(montoPuja) > subasta.precio_actual) {
                    const idUsuario = await AsyncStorage.getItem('usuarioId');
                    const data = {
                        subasta: {
                            id: subastaId
                        },
                        usuario: {
                            id: idUsuario
                        },
                        monto: Number(montoPuja)
                    }
                    navigation.navigate("VerifyBid", data);
                } else {
                    Alert.alert("ERROR ❌", "Señor usuario, recuerde que debe ingresar un monto mayor al que se encuentra actualmente en la subasta.");
                }
            } else {
                Alert.alert("ERROR ❌", "Señor usuario usted no cuenta con el monto que ha ingresado.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <ScrollView style={styles.scollView}>
            <View style={styles.container}>
                <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
                <Text style={styles.title}>🤚 Detalles de subasta</Text>
                {subasta && (
                    <CustomCardDetailProduct
                        image={subasta.producto.imagen_url}
                        name={subasta.producto.nombre}
                        description={subasta.producto.descripcion}
                        state={subasta.producto.estado_producto.nombre}
                        price={subasta.precio_actual}
                        owner={subasta.producto.propietario}
                        owner_name={subasta.producto.propietario.nombre + " " + subasta.producto.propietario.apellido}
                    />
                )}
                {comprador && (
                    <Text style={styles.credit}>Dinero actual: {comprador.monto}</Text>
                )}
                <Text style={styles.text_info}>¡¡¡ Recuerde que el monto debe ser mayor a la cantidad actual, para que la puja sea válida. !!!</Text>
                <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Monto" placeholderTextColor={colors.menu_inactive_option} value={montoPuja} onChangeText={setMontoPuja} />
                <CustomButton title={"Confirmar puja"} onPress={() => confirmarPuja()} />
            </View>
        </ScrollView>
    )
}

export default Bid;