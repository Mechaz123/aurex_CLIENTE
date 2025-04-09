import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Authentication from "../../../services/Authentication";
import { Alert, FlatList, ScrollView, Text, View } from "react-native";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import CustomCardViewAuction from "../../../components/CustomCardViewAuction/CustomCardViewAuction";

const ViewAuctions = () => {
    const [loading, setLoading] = useState(false);
    const [subastas, setSubastas] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarSubastas();
            return (() => {
                setLoading(false);
                setSubastas([]);
            })
        }, [])
    )

    const cargarSubastas = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const ID = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `subasta/propietario/${ID}`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setSubastas(response.Data);
                } else {
                    Alert.alert("ERROR ❌", "Usted no tiene subastas registradas.");
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo obtener las subastas.");
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
            <View style={styles.container_title}>
                <Text style={styles.title}>🤚🏻 Ver subastas</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={subastas} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CustomCardViewAuction subasta={item} />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default ViewAuctions;