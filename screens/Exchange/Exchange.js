import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Authentication from "../../services/Authentication";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import styles from "./styles";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import CustomCard from "../../components/CustomCard/CustomCard";

const Exchange = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [opcionesCategoriasPrincipales, setOpcionesCategoriasPrincipales] = useState([]);
    const [opcionesCategoriasSecundarias, setOpcionesCategoriasSecundarias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [requisitosIntercambio, setRequisitosIntercambio] = useState(false);
    const [categoriaPrincipalSeleccionada, setCategoriaPrincipalSeleccionada] = useState(null);
    const [categoriaSecundariaSeleccionada, setCategoriaSecundariaSeleccionada] = useState(null);
    const [categoriasSecundariasFiltradas, setCategoriasSecundariasFiltradas] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarCategoriasPrincipalesOpciones();
            cargarCategoriasSecundariasOpciones();
            cargarProductos();
            verificarRequisitosIntercambio();
            return (() => {
                setLoading(false);
                setOpcionesCategoriasPrincipales([]);
                setOpcionesCategoriasSecundarias([]);
                setProductos([]);
                setRequisitosIntercambio(false);
                setCategoriaPrincipalSeleccionada(null);
                setCategoriaSecundariaSeleccionada(null);
                setCategoriasSecundariasFiltradas([]);
                setProductosFiltrados([]);
            });
        }, [])
    )

    const cargarCategoriasPrincipalesOpciones = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `categoria/categorias_principales`);

            if (response.Success) {
                setOpcionesCategoriasPrincipales(response.Data);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones de categorias principales.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarCategoriasSecundariasOpciones = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `categoria/categorias_secundarias`);

            if (response.Success) {
                setOpcionesCategoriasSecundarias(response.Data);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones de categorias secundarias.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarProductos = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `producto/intercambio/${usuarioId}`);

            if (response.Success) {
                setProductos(response.Data);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar los productos.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const verificarRequisitosIntercambio = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `intercambio/verificar_requisitos/${usuarioId}`);

            if (response.Success) {
                setRequisitosIntercambio(response.Data);
                setLoading(false);
                if (!response.Data) {
                    Alert.alert("ADVERTENCIA ⚠️", "Actualmente usted no tiene productos para intercambiar.");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo verificar los requisitos para realizar intercambios.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const filtrarCategoriasSecundariasOpciones = async (categoriaPrincipal) => {
        setLoading(true);
        setCategoriaPrincipalSeleccionada(categoriaPrincipal);

        if (Authentication.verificarTokenGuardado()) {
            if (categoriaPrincipal != null) {
                const resultadoFiltro = opcionesCategoriasSecundarias.filter(categoria =>
                    categoria.categoria_principal.id == categoriaPrincipal
                );
                setCategoriasSecundariasFiltradas(resultadoFiltro);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const filtrarProductosPorCategoria = async (categoriaSecundaria) => {
        setLoading(true);
        setCategoriaSecundariaSeleccionada(categoriaSecundaria);

        if (Authentication.verificarTokenGuardado()) {
            if (categoriaSecundaria != null) {
                const resultadoFiltro = productos.filter(producto =>
                    producto.categoria.id == categoriaSecundaria
                );

                if (resultadoFiltro.length != 0) {
                    setProductosFiltrados(resultadoFiltro);
                    setLoading(false);
                } else {
                    setProductosFiltrados(resultadoFiltro);
                    setLoading(false);
                    Alert.alert("WARNING ⚠️", "No se encuentran productos para las categorías seleccionadas.");
                }
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const detallesProducto = async (idProducto) => {
        const ID = idProducto;
        navigation.navigate("DetailsProductExchange", { ID });
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>🤝 Intercambiar</Text>
            {requisitosIntercambio && (
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Seleccione la categoría principal</Text>
                    <Picker style={styles.picker} selectedValue={categoriaPrincipalSeleccionada} dropdownIconColor={colors.primary} onValueChange={(itemValue) => filtrarCategoriasSecundariasOpciones(itemValue)}>
                        <Picker.Item label="Ninguno" value={null} />
                        {opcionesCategoriasPrincipales.map((option, index) => (
                            <Picker.Item key={index} label={option.nombre} value={option.id} />
                        ))}
                    </Picker>
                </View>
            )}
            {categoriaPrincipalSeleccionada && (
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Seleccione la categoría secundaria</Text>
                    <Picker style={styles.picker} selectedValue={categoriaSecundariaSeleccionada} dropdownIconColor={colors.primary} onValueChange={(itemValue) => filtrarProductosPorCategoria(itemValue)}>
                        <Picker.Item label="Ninguno" value={null} />
                        {categoriasSecundariasFiltradas.map((option, index) => (
                            <Picker.Item key={index} label={option.nombre} value={option.id} />
                        ))}
                    </Picker>
                </View>
            )}
            {categoriaSecundariaSeleccionada && (
                <View style={styles.container}>
                    <Text style={styles.text_products}>Seleccione el producto que desea intercambiar.</Text>
                    <FlatList data={productosFiltrados} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => detallesProducto(item.id)}>
                                <CustomCard title={item.nombre} description={item.descripcion} image={item.imagen_url} state={item.estado_producto.nombre} price={item.precio} stock={item.existencias} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

export default Exchange;