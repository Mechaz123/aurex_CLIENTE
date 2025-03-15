import { useEffect, useState } from "react";
import Authentication from "../../../../services/Authentication";
import Utils from "../../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL,AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, Text, View } from "react-native";
import colors from "../../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import CustomCardDetailProduct from "../../../../components/CustomCardDetailProduct/CustomCardDetailProduct";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsProduct = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState(null);
    const [comprador, setComprador] = useState(null);

    useEffect(() => {
        cargarProducto();
        cargarCreditoUsuario();
        return (() => {
            ID = undefined;
        });
    }, [route.params])

    const cargarProducto = async () => {
        setLoading(true);
        
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${ID}`);

            if (response.Success) {
                setProducto(response.Data);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar la información del producto.");
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
                Alert.alert("ERROR ❌", "No se pudo cargar la información del comprador.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>🛍️ Detalles del producto</Text>
            {producto && (
                <CustomCardDetailProduct 
                    image={producto.imagen_url}
                    name={producto.nombre}
                    description={producto.descripcion}
                    state={producto.estado_producto.nombre}
                    price={producto.precio}
                    owner={producto.propietario}
                    owner_name={producto.propietario.nombre + " " + producto.propietario.apellido}
                />
            )}
        </View>
    )
}

export default DetailsProduct;