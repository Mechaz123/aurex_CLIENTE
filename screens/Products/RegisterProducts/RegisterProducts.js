import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import React, { useCallback, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { Picker } from "@react-native-picker/picker";
import Authentication from "../../../services/Authentication";
import { useFocusEffect } from "@react-navigation/native";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL, AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import RNFS from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterProducts = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [productoNombre, setProductoNombre] = useState(null);
    const [productoDescripcion, setProductoDescripcion] = useState(null);
    const [productoPrecio, setProductoPrecio] = useState(null);
    const [productoExistencias, setProductoExistencias] = useState(null);
    const [productoImagen, setProductoImagen] = useState(null);
    const [productoCategoria, setProductoCategoria] = useState(null);
    const [productoEstado, setProductoEstado] = useState(null);
    const [productoDestino, setProductoDestino] = useState(null);
    const [opcionesCategoria, setOpcionesCategoria] = useState([]);
    const [opcionesCategoriaDisponibles, setOpcionesCategoriaDisponibles] = useState([]);
    const [opcionesProductoEstado, setOpcionesProductoEstado] = useState([]);
    const [estaEditando, setEstaEditando] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cargarProductoOpcionesCategoria();
            cargarOpcionesEstadoProducto();
            cargarDataProducto();
            return (() => {
                setProductoNombre(null);
                setProductoDescripcion(null);
                setProductoPrecio(null);
                setProductoExistencias(null);
                setProductoImagen(null);
                setProductoCategoria(null);
                setProductoEstado(null);
                setProductoDestino(null);
                setOpcionesCategoria([]);
                setOpcionesCategoriaDisponibles([]);
                setOpcionesProductoEstado([]);
                setEstaEditando(false);
                ID = undefined;
            })
        }, [route.params])
    );

    const cargarDataProducto = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (ID != undefined) {
                setEstaEditando(true);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${ID}`);

                if (response.Success) {
                    setProductoNombre(response.Data.nombre);
                    setProductoDescripcion(response.Data.descripcion);
                    setProductoPrecio(response.Data.precio);
                    setProductoExistencias(String(response.Data.existencias));
                    setProductoCategoria(response.Data.categoria.id);
                    setProductoEstado(response.Data.estado_producto.id);
                    setProductoDestino(response.Data.destino);

                    if (response.Data.imagen_url != null) {
                        setProductoImagen(String(response.Data.imagen_url));
                    }
                } else {
                    Alert.alert("ERROR ❌", "No se pudo cargar la data.");
                }
            } else {
                setEstaEditando(false);
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarProductoOpcionesCategoria = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `categoria/categorias_secundarias`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    const categorias = response.Data;
                    setOpcionesCategoria(response.Data);
                    const categorias_filtradas = categorias.filter(
                        categoria => !categoria.nombre.includes("Donación")
                    )
                    setOpcionesCategoriaDisponibles(categorias_filtradas);

                }
            } else {
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones de categoria.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarOpcionesEstadoProducto = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `estado_producto`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesProductoEstado(response.Data);
                }
            } else {
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones de estado del producto.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const seleccionarImagen = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const imagenUri = response.assets[0].uri;
                try {
                    const base64Imagen = await RNFS.readFile(imagenUri, 'base64');
                    setProductoImagen(base64Imagen);
                } catch (error) {
                    Alert.alert("ERROR ❌", "No se pudo guardar la imagen.");
                }
            }
        });
    };

    const filtrarDestinoCategoria = async (itemValue) => {
        setProductoDestino(itemValue);

        if (itemValue == "Donación") {
            const CategoriaDonacion = await opcionesCategoria.find(
                categoria => categoria.nombre.includes("Donación")
            )
            setProductoCategoria(CategoriaDonacion.id);
        } else {
            setProductoCategoria(null);
        }
    }

    const crearProducto = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            
            if (productoNombre && productoPrecio && productoExistencias && productoDestino && productoCategoria && productoEstado && productoImagen) {
                const data = {
                    "nombre": productoNombre,
                    "descripcion": productoDescripcion,
                    "precio": productoPrecio,
                    "existencias": productoExistencias,
                    "imagen_url": productoImagen,
                    "destino": productoDestino,
                    "propietario": {
                        "id": usuarioId
                    },
                    "categoria": {
                        "id": productoCategoria
                    },
                    "estado_producto": {
                        "id": productoEstado
                    }
                }

                const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto`, data);

                if (response.Success) {
                    Alert.alert("EXITO ✅", "El producto ha sido creado.");
                    navigation.replace("Menu");
                } else {
                    Alert.alert("ERROR ❌", "El producto no fue creado.");
                }
            } else {
                Alert.alert(
                    "ERROR ❌",
                    "Complete el formulario, los siguientes campos son requeridos para crear el producto:\n\n- Nombre \n- Precio \n- Existencias \n- Imagen del producto \n- Destinación del producto \n- Categoria \n- Estado del producto"
                );
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editarProducto = async () => {
        if (await Authentication.verificarTokenGuardado()) {

            if (productoNombre && productoPrecio && productoExistencias && productoDestino && productoCategoria && productoEstado && productoImagen) {
                const data = {
                    "nombre": productoNombre,
                    "descripcion": productoDescripcion,
                    "precio": productoPrecio,
                    "existencias": productoExistencias,
                    "imagen_url": productoImagen,
                    "destino": productoDestino,
                    "categoria": {
                        "id": productoCategoria
                    },
                    "estado_producto": {
                        "id": productoEstado
                    }
                }

                const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `producto/${ID}`, data);

                if (response.Success) {
                    Alert.alert("EXITO ✅", "El producto ha sido editado.");
                    navigation.replace("Menu");
                } else {
                    Alert.alert("ERROR ❌", "El producto no fue editado.");
                }
            } else {
                Alert.alert(
                    "ERROR ❌",
                    "Complete el formulario, los siguientes campos son requeridos para crear el producto:\n\n- Nombre \n- Precio \n- Existencias \n- Imagen del producto \n- Destinación del producto \n- Categoria \n- Estado del producto."
                );
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>{estaEditando ? "✏️ Editar Producto" : "✏️ Registrar Producto"}</Text>
                <TextInput style={styles.textInput} placeholder="Nombre" placeholderTextColor={colors.menu_inactive_option} value={productoNombre} onChangeText={setProductoNombre} />
                <TextInput style={styles.textArea} multiline={true} numberOfLines={6} placeholder="Descripción" placeholderTextColor={colors.menu_inactive_option} value={productoDescripcion} onChangeText={setProductoDescripcion} />
                <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Precio" placeholderTextColor={colors.menu_inactive_option} value={productoPrecio} onChangeText={setProductoPrecio} />
                <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Existencias" placeholderTextColor={colors.menu_inactive_option} value={productoExistencias} onChangeText={setProductoExistencias} />
                <CustomButton title="📷 Seleccione la imagen" onPress={seleccionarImagen} />
                {productoImagen && (
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageTitle}>🖼️ Vista previa</Text>
                        <Image source={{ uri: `data:image/png;base64,${productoImagen}` }} style={styles.image} />
                    </View>
                )}
                <Text style={styles.firsttextSelect}>Seleccione el destino del producto</Text>
                <Picker style={styles.picker} selectedValue={productoDestino} dropdownIconColor={colors.primary} onValueChange={(itemValue) => filtrarDestinoCategoria(itemValue)}>
                    <Picker.Item label="Ninguno" value={null} />
                    <Picker.Item label="Venta" value="Venta" />
                    <Picker.Item label="Intercambio" value="Intercambio" />
                    <Picker.Item label="Subasta" value="Subasta" />
                    <Picker.Item label="Donación" value="Donación" />
                </Picker>
                {productoDestino != "Donación" && (
                    <>
                        <Text style={styles.textSelect}>Seleccione la categoria del producto</Text><Picker style={styles.picker} selectedValue={productoCategoria} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setProductoCategoria(itemValue)}>
                            <Picker.Item label="Ninguno" value={null} />
                            {opcionesCategoriaDisponibles.map((option, index) => (
                                <Picker.Item key={index} label={option.nombre} value={option.id} />
                            ))}
                        </Picker>
                    </>
                )}
                <Text style={styles.textSelect}>Seleccione el estado del producto</Text><Picker style={styles.picker} selectedValue={productoEstado} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setProductoEstado(itemValue)}>
                    <Picker.Item label="Ninguno" value={null} />
                    {opcionesProductoEstado.map((option, index) => (
                        <Picker.Item key={index} label={option.nombre} value={option.id} />
                    ))}
                </Picker>
                <CustomButton title={estaEditando ? "Editar" : "Crear"} onPress={estaEditando ? editarProducto : crearProducto} />
            </View>
        </ScrollView>
    )
}

export default RegisterProducts;