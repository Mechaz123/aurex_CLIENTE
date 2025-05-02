import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react"
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import CustomCardParticipateAuction from "../../../components/CustomCardParticipateAuction/CustomCardParticipateAuction";

const ParticipateAuction = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [subastasActivas, setSubastasActivas] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarSubastasActivas();
            return (() => {
                setLoading(false);
                setSubastasActivas([]);
            })
        }, [])
    )

    const cargarSubastasActivas = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const responseComprobar = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `subasta/comprobar`);

            if (responseComprobar.Success) {
                const responseSubastasActivas = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `subasta/activas`);

                if (responseSubastasActivas.Success) {
                    if (Object.keys(responseSubastasActivas.Data).length != 0) {
                        setSubastasActivas(responseSubastasActivas.Data);
                    } else {
                        Alert.alert("ADVERTENCIA ⚠️", "Actualmente no existen subastas activas.")
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "No se pudo consultar las subastas activas.");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo comprobar el estado de las subastas.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const puja = async (subastaId) => {
        navigation.navigate("Bid", subastaId);
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <View style={styles.container_title}>
                <Text style={styles.title}>🤚 Participar en subasta</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={subastasActivas} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CustomCardParticipateAuction subasta={item}
                                puja={() => puja(item.id)}
                            />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default ParticipateAuction;