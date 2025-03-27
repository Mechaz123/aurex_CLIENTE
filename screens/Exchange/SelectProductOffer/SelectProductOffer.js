import { useEffect, useState } from "react";
import Authentication from "../../../services/Authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../../styles/colors";
import CustomCard from "../../../components/CustomCard/CustomCard";

const SelectProductOffer = ({ navigation, route }) => {
    let data = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [productosIntercambio, setProductosIntercambio] = useState([]);

    useEffect(() => {
        cargarProductosIntercambiar();
        return (() => {
            data = undefined;
            setLoading(false);
            setProductosIntercambio([]);
        });
    }, [route.params])

    const cargarProductosIntercambiar = async () => {
        setLoading(true);
        
        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `producto/intercambio/propietario/${usuarioId}`);

            if (response.Success) {
                setProductosIntercambio(response.Data);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar los productos para intercambiar.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const detalleProductoIntercambio= async (idProductoOfertante) => {
        const updatedData = { ...data,
            producto_ofrecido:{
                id: idProductoOfertante
            }};
        navigation.navigate("DetailsProductOffer", updatedData);
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>🤝 Productos para intercambiar</Text>
            <Text style={styles.text}>Seleccione su producto que desea intercambiar.</Text>
            <FlatList data={productosIntercambio} keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => detalleProductoIntercambio(item.id)}>
                        <CustomCard title={item.nombre} description={item.descripcion} image={item.imagen_url} state={item.estado_producto.nombre} price={item.precio} stock={item.existencias} />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default SelectProductOffer;