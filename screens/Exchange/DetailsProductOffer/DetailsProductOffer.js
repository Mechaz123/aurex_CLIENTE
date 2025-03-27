import { useEffect, useState } from "react";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../../styles/colors";
import CustomCardDetailProduct from "../../../components/CustomCardDetailProduct/CustomCardDetailProduct";
import CustomButton from "../../../components/CustomButton/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsProductOffer = ({ navigation, route }) => {
    let data = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState(null);
    const [cantidadProducto, setCantidadProducto] = useState(1);
    const [existenciasDisponibles, setExistenciasDisponibles] = useState(true);

    useEffect(() => {
        cargarProducto();
        return (() => {
            data = undefined;
            setLoading(false);
        });
    }, [route.params])

    const cargarProducto = async () => {
        setLoading(true);

        if (Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${data.producto_ofrecido.id}`);

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
            Alert.alert("ERROR ❌", "Señor usuario actualmente no cuenta con la cantidad de productos que ha seleccionado.")
        } else {
            setExistenciasDisponibles(true);
        }
    }

    const confirmarIntercambio = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (existenciasDisponibles) {
                const usuarioId = await AsyncStorage.getItem('usuarioId');
                const updatedData = { ...data, 
                    usuario_ofertante:{
                        id: Number(usuarioId)
                    },
                    cantidad_ofrecida: cantidadProducto
                };
                navigation.navigate("VerifyExchange", updatedData);
            } else {
                Alert.alert("ERROR ❌", "Señor usuario actualmente no cuenta con la cantidad de productos que desea, por favor seleccione una cantidad menor.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <ScrollView style={styles.scollView}>
            <View style={styles.container} >
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
                <CustomButton title={"Confirmar producto ofertante"} onPress={() => confirmarIntercambio()} />
            </View>
        </ScrollView>
    )
}

export default DetailsProductOffer;