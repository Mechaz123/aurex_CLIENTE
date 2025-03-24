import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react"
import Authentication from "../../services/Authentication";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import styles from "./styles";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../styles/colors";
import CustomCardPurchaseHistory from "../../components/CustomCardPurchaseHistory/CystomCardPurchaseHistory";

const PurchaseHistory = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [comprasRealizadas, setComprasRealizadas] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarComprasRealizadas();
            return (() => {
                setLoading(false);
                setComprasRealizadas([]);
            });
        }, [])
    )

    const cargarComprasRealizadas = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `pedido/historial_compra/${usuarioId}`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setComprasRealizadas(response.Data);
                } else {
                    Alert.alert("ADVERTENCIA ⚠️", "Actualmente no tiene ninguna compra registrada.")
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las compras realizadas.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const confirmarEntrega = async (idPedido, idVendedor) => {
        if (await Authentication.verificarTokenGuardado()) {
            Alert.alert(
                "CONFIRMAR ENTREGA DEL PEDIDO",
                "¿Esta seguro/a de confirmar la entrega del pedido?",
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
                                "idPedido": idPedido,
                                "idVendedor": idVendedor
                            }

                            const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `pedido/confirmar_entrega`, data);

                            if (response.Success) {
                                setLoading(false);
                                Alert.alert("EXITO ✅", "Se ha confirmado la entrega del pedido.");
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
                <Text style={styles.title}>📦 Compras</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={comprasRealizadas} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CustomCardPurchaseHistory detallePedido={item}
                                confirmarEntrega={() => confirmarEntrega(item.pedido.id, item.producto.propietario.id)}
                            />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default PurchaseHistory;