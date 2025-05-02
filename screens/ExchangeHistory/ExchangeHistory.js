import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Authentication from "../../services/Authentication";
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import Utils from "../../services/Utils";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../styles/colors";
import styles from "./styles";
import CustomCardHistoryExchange from "../../components/CustomCardHistoryExchange/CustomCardHistoryExchange";

const ExchangeHistory = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [historialIntercambio, setHistorialIntercambio] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarHistorialSolicitudes();
            return (() => {
                setLoading(false);
                setHistorialIntercambio([]);
            });
        }, [])
    )

    const cargarHistorialSolicitudes = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `intercambio/historial/${usuarioId}`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setHistorialIntercambio(response.Data);
                } else {
                    Alert.alert("ADVERTENCIA ⚠️", "Actualmente no tiene ninguna solicitud registrada.")
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las solicitudes de intercambio realizadas."); v
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const rechazarIntercambio = async (idHistorialIntercambio) => {
        if (await Authentication.verificarTokenGuardado()) {
            Alert.alert(
                "RECHAZAR SOLICITUD DE INTERCAMBIO",
                "¿Esta seguro/a de rechazar la solicitud de intercambio?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Si",
                        onPress: async () => {
                            setLoading(true);

                            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `intercambio/rechazar_solicitud/${idHistorialIntercambio}`);

                            if (response.Success) {
                                setLoading(false);
                                Alert.alert("EXITO ✅", "Se ha rechazado exitosamente la solicitud.");
                                navigation.replace("Menu");
                            } else {
                                setLoading(false);
                                Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
                            }
                        }
                    }
                ]
            )
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const aceptarIntercambio = async (idHistorialIntercambio) => {
        if (await Authentication.verificarTokenGuardado()) {
            Alert.alert(
                "ACEPTAR SOLICITUD DE INTERCAMBIO",
                "¿Esta seguro/a de aceptar la solicitud de intercambio?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Si",
                        onPress: async () => {
                            setLoading(true);

                            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `intercambio/aceptar_solicitud/${idHistorialIntercambio}`);

                            if (response.Success) {
                                setLoading(false);
                                Alert.alert("EXITO ✅", "Se ha aceptado exitosamente la solicitud.");
                                navigation.replace("Menu");
                            } else {
                                setLoading(false);
                                Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
                            }
                        }
                    }
                ]
            )
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <View style={styles.container_title}>
                <Text style={styles.title}>📋 Historial de intercambio</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={historialIntercambio} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CustomCardHistoryExchange historialIntercambio={item}
                                rechazar={() => rechazarIntercambio(item.id)}
                                aceptar={() => aceptarIntercambio(item.id)}
                            />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default ExchangeHistory;