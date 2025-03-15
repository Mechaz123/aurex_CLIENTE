import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Authentication from "../../../services/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "../../../services/Utils";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import CustomCard from "../../../components/CustomCard/CustomCard";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";

const AuctionProducts = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [productosPropietario, setProductosPropietario] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarProductosPropietario();
            return (() => {
                setLoading(false);
                setProductosPropietario([]);
            })
        }, [])
    );

    const cargarProductosPropietario = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `producto/subasta/propietario/${usuarioId}`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setProductosPropietario(response.Data);
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar los productos del propietario.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editarProducto = async (ID) => {
        navigation.navigate("RegisterProducts", { ID });
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>💲Productos para subastar</Text>
            <Text style={styles.text}>Seleccione un producto si desea cambiar su información.</Text>
            <FlatList data={productosPropietario} keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => editarProducto(item.id)}>
                        <CustomCard title={item.nombre} description={item.descripcion} image={item.imagen_url} state={item.estado_producto.nombre} price={item.precio} stock={item.existencias} />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default AuctionProducts;