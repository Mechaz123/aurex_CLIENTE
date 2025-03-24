import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Authentication from "../../services/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import styles from "./styles";
import CustomCardOrder from "../../components/CustomCardOrder/CustomCardOrder";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../styles/colors";

const Order = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [productosPedidosPropietario, setProductosPedidosPropietario] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarSolicitudesPedidos();
            return (() => {
                setLoading(false);
                setProductosPedidosPropietario([]);
            });
        }, [])
    );

    const cargarSolicitudesPedidos = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `pedido/productos_pedido_propietario/${usuarioId}`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setProductosPedidosPropietario(response.Data);
                } else {
                    Alert.alert("ADVERTENCIA ⚠️", "Actualmente no tiene solicitudes de venta.")
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las solicitudes de venta.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const confirmarEnvio = async (id) => {
        if (await Authentication.verificarTokenGuardado()) {

            Alert.alert(
                "CONFIRMAR ENVÍO DEL PEDIDO",
                "¿Esta seguro/a de confirmar el envío del pedido?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Si",
                        onPress: async () => {
                            setLoading(true);
                            const data = {
                                "idPedido": id
                            }

                            const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `pedido/confirmar_envio`, data);

                            if (response.Success) {
                                setLoading(false);
                                Alert.alert("EXITO ✅", "Se ha confirmado el envío del pedido.");
                                navigation.replace("Menu");
                            } else {
                                setLoading(false);
                                Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
                            }
                        }
                    }
                ]
            )
        }
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <View style={styles.container_title}>
                <Text style={styles.title}>📋 Pedidos</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={productosPedidosPropietario} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CustomCardOrder detallePedido={item}
                                confirmarEnvio={() => confirmarEnvio(item.pedido.id)}
                            />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default Order;