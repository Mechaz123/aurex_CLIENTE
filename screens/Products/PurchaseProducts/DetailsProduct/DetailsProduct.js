import { useEffect, useState } from "react";
import Authentication from "../../../../services/Authentication";
import Utils from "../../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import colors from "../../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import CustomCardDetailProduct from "../../../../components/CustomCardDetailProduct/CustomCardDetailProduct";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../../../components/CustomButton/CustomButton";

const DetailsProduct = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState(null);
    const [cantidadProducto, setCantidadProducto] = useState(1);
    const [totalProducto, setTotalProducto] = useState(null);
    const [comprador, setComprador] = useState(null);
    const [existenciasDisponibles, setExistenciasDisponibles] = useState(true);

    useEffect(() => {
        cargarProducto();
        cargarCreditoUsuario();
        return (() => {
            ID = undefined;
            setLoading(false);
            setProducto(null);
            setCantidadProducto(1);
            setTotalProducto(null);
            setComprador(null);
            setExistenciasDisponibles(false);
        });
    }, [route.params])

    const cargarProducto = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${ID}`);

            if (response.Success) {
                setProducto(response.Data);
                setTotalProducto(Number(response.Data.precio));
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

    const cambiarCantidad = (accion) => {
        let resultado = cantidadProducto;
        if (accion == "sumar") {
            resultado = resultado + 1;
        } else if (accion == "restar") {
            if (cantidadProducto > 1) {
                resultado = resultado - 1;
            }
        }
        setCantidadProducto(resultado);

        const total = (Number(producto.precio) * Number(resultado)).toFixed(2);
        setTotalProducto(Number(total));
        verificarExistenciasProducto(resultado);
    }

    const verificarExistenciasProducto = (cantidad) => {
        if (cantidad > producto.existencias) {
            setExistenciasDisponibles(false);
            Alert.alert("ERROR ❌", "Señor usuario actualmente no contamos con la cantidad de productos que requiere.")
        } else {
            setExistenciasDisponibles(true);
        }
    }

    const confirmarCompra = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (existenciasDisponibles) {
                if (comprador.monto > totalProducto) {
                    const idProducto = producto.id;
                    const cantidad = cantidadProducto;
                    const totalPago = totalProducto;
                    
                    navigation.navigate("VerifyPurchase", { idProducto, cantidad, totalPago });
                } else {
                    Alert.alert("ERROR ❌", "Señor usuario usted no cuenta con el monto requerido para realizar dicha compra.");
                }
            } else {
                Alert.alert("ERROR ❌", "Señor usuario actualmente no contamos con la cantidad de productos que requiere, por favor seleccione una cantidad menor.");
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
                {comprador && (
                    <Text style={styles.credit}>Dinero actual: {comprador.monto}</Text>
                )}
                <View style={styles.quantity_container}>
                    <TouchableOpacity style={styles.quantity_button} onPress={() => cambiarCantidad("restar")}>
                        <Text style={styles.quantity_button_text}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity_text}>{cantidadProducto}</Text>
                    <TouchableOpacity style={styles.quantity_button} onPress={() => cambiarCantidad("sumar")}>
                        <Text style={styles.quantity_button_text}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.text_total}>Total: {totalProducto}</Text>
                <CustomButton title={"Confirmar compra"} onPress={() => confirmarCompra()}/>
            </View>
        </ScrollView>
    )
}

export default DetailsProduct;