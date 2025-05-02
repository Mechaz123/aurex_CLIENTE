import { useEffect, useState } from "react";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../../styles/colors";
import CustomCardDetailProduct from "../../../components/CustomCardDetailProduct/CustomCardDetailProduct";
import styles from "./styles";
import CustomButton from "../../../components/CustomButton/CustomButton";

const DetailsProductExchange = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState(null);
    const [cantidadProducto, setCantidadProducto] = useState(1);
    const [existenciasDisponibles, setExistenciasDisponibles] = useState(true);

    useEffect(() => {
        cargarProducto();
        return (() => {
            ID = undefined;
            setLoading(false);
            setProducto(null);
            setCantidadProducto(1);
            setExistenciasDisponibles(false);
        });
    }, [route.params])

    const cargarProducto = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${ID}`);

            if (response.Success) {
                setProducto(response.Data);
                setLoading(false);
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

    const confirmarProductoSolicitante = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (existenciasDisponibles) {
                const data = {
                    usuario_solicitante: {
                        id: producto.propietario.id
                    },
                    producto_solicitante:{
                        id: producto.id
                    },
                    cantidad_solicitada: cantidadProducto
                }

                navigation.navigate("SelectProductOffer", data);
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
                <Text style={styles.title}>🤝 Detalles del producto</Text>
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
                <View style={styles.quantity_container}>
                    <TouchableOpacity style={styles.quantity_button} onPress={() => cambiarCantidad("restar")}>
                        <Text style={styles.quantity_button_text}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity_text}>{cantidadProducto}</Text>
                    <TouchableOpacity style={styles.quantity_button} onPress={() => cambiarCantidad("sumar")}>
                        <Text style={styles.quantity_button_text}>+</Text>
                    </TouchableOpacity>
                </View>
                <CustomButton title={"Confirmar producto solicitante"} onPress={() => confirmarProductoSolicitante()} />
            </View>
        </ScrollView>
    )
}

export default DetailsProductExchange;