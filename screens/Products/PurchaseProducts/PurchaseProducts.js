import React, { useCallback, useState } from 'react';
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from './styles';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../../styles/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import Authentication from '../../../services/Authentication';
import Utils from '../../../services/Utils';
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import CustomCardPurchase from '../../../components/CustomCardPurchase/CustomCardPurchase';

const PurchaseProducts = () => {
    const [loading, setLoading] = useState(false);
    const [opcionesCategoriasPrincipales, setOpcionesCategoriasPrincipales] = useState([]);
    const [opcionesCategoriasSecundarias, setOpcionesCategoriasSecundarias] = useState([]);
    const [categoriaPrincipalSeleccionada, setCategoriaPrincipalSeleccionada] = useState(null);
    const [categoriaSecundariaSeleccionada, setCategoriaSecundariaSeleccionada] = useState(null);
    const [categoriasSecundariasFiltradas, setCategoriasSecundariasFiltradas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarCategoriasPrincipalesOpciones();
            cargarCategoriasSecundariasOpciones();
            cargarProductos();
            return (() => {
                setLoading(false);
                setOpcionesCategoriasPrincipales([]);
                setOpcionesCategoriasSecundarias([]);
                setCategoriaPrincipalSeleccionada(null);
                setCategoriaSecundariaSeleccionada(null);
                setCategoriasSecundariasFiltradas([]);
                setProductos([]);
                setProductosFiltrados([]);
            });
        }, [])
    );

    const cargarCategoriasPrincipalesOpciones = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `categoria/categorias_principales`);

            if (response.Success) {
                const resultadoFiltro = response.Data.filter(categoria =>
                    categoria.nombre != "Donación"
                );
                setOpcionesCategoriasPrincipales(resultadoFiltro);
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
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `producto/venta`);

            if (response.Success) {
                setProductos(response.Data);
                setLoading(false);
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

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>🛍️ Comprar</Text>
            <View style={styles.selectContainer}>
                <Text style={styles.textSelectContainer}>Seleccione la categoría principal</Text>
                <Picker style={styles.picker} selectedValue={categoriaPrincipalSeleccionada} dropdownIconColor={colors.primary} onValueChange={(itemValue) => filtrarCategoriasSecundariasOpciones(itemValue)}>
                    <Picker.Item label="Ninguno" value={null} />
                    {opcionesCategoriasPrincipales.map((option, index) => (
                        <Picker.Item key={index} label={option.nombre} value={option.id} />
                    ))}
                </Picker>
            </View>
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
                    <Text style={styles.text_products}>Seleccione el producto que desea comprar.</Text>
                    <FlatList data={productosFiltrados} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity>
                                <CustomCardPurchase title={item.nombre} description={item.descripcion} image={item.imagen_url} price={item.precio} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

export default PurchaseProducts;