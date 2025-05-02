import React, { useCallback, useState } from "react";
import { Alert, Switch, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL, AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

const RegisterCategory = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [categoriaNombre, setCategoriaNombre] = useState(null);
    const [categoriaDescripcion, setCategoriaDescripcion] = useState(null);
    const [mostrarSelector, setMostrarSelector] = useState(false);
    const [categoriaPrincipal, setCategoriaPrincipal] = useState(null);
    const [opcionesCategoria, setOpcionesCategoria] = useState([]);
    const [estaEditando, setEstaEditando] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cargarDataCategoria();
            cargarOpcionesCategoria();
            return (() => {
                setLoading(false);
                setCategoriaNombre(null);
                setCategoriaDescripcion(null);
                setMostrarSelector(false);
                setCategoriaPrincipal(null);
                setOpcionesCategoria([]);
                setEstaEditando(false);
                ID = undefined;
            })
        }, [route.params])
    );

    const cargarDataCategoria = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {

            if (ID != undefined) {
                setEstaEditando(true);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria/${ID}`);
    
                if (response.Success) {
                    setCategoriaNombre(response.Data.nombre);
                    setCategoriaDescripcion(response.Data.descripcion);

                    if (response.Data.categoria_principal != null) {
                        setMostrarSelector(true);
                        setCategoriaPrincipal(response.Data.categoria_principal.id);
                    }
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "No se pudo cargar la data.");
                }
            } else {
                setEstaEditando(false);
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarOpcionesCategoria = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `categoria/categorias_principales`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesCategoria(response.Data);
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const crearCategoria = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            let data = {
                "nombre": categoriaNombre,
                "descripcion": categoriaDescripcion,
            }

            if (categoriaNombre) {
                if (mostrarSelector) {
                    if (categoriaPrincipal) {
                        data.categoria_principal = categoriaPrincipal;
                        const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria`, data);

                        if (response.Success) {
                            setLoading(false);
                            Alert.alert("EXITO ✅", "La categoria ha sido creada.");
                            navigation.replace("Menu");
                        } else {
                            setLoading(false);
                            Alert.alert("ERROR ❌", "La categoria no fue creada.");
                        }
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "Por favor seleccione la categoria principal.");
                    }
                } else {
                    data.categoria_principal = null;
                    const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria`, data);

                    if (response.Success) {
                        setLoading(false);
                        Alert.alert("Success ✅", "La categoria ha sido creada.");
                        navigation.replace("Menu");
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "La categoria no fue creada.");
                    }
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Por favor complete los campos.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editarCategoria = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            let data = {
                "nombre": categoriaNombre,
                "descripcion": categoriaDescripcion,
            }

            if (data.nombre && data.nombre) {
                if (mostrarSelector) {
                    if (categoriaPrincipal) {
                        data.categoria_principal = categoriaPrincipal;
                        const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria/${ID}`, data);

                        if (response.Success) {
                            setLoading(false);
                            Alert.alert("EXITO ✅", "La categoria fue editada.");
                            navigation.replace("Menu");
                        } else {
                            setLoading(false);
                            Alert.alert("ERROR ❌", "La categoria no fue editada.");
                        }
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "Por favor seleccione una categoria principal.");
                    }
                } else {
                    data.categoria_principal = null;
                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria/${ID}`, data);

                    if (response.Success) {
                        setLoading(false);
                        Alert.alert("EXITO ✅", "La categoria fue editada.");
                        navigation.replace("Menu");
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "La categoria no fue editada.");
                    }
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Por favor complete los campos.");
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
            <Text style={styles.title}>{estaEditando ? "✏️ Editar Categoria" : "✏️ Registrar Categoria"}</Text>
            <TextInput style={styles.textInput} placeholder="Nombre" placeholderTextColor={colors.menu_inactive_option} value={categoriaNombre} onChangeText={setCategoriaNombre} />
            <TextInput style={styles.textArea} multiline={true} numberOfLines={6} placeholder="Descripción" placeholderTextColor={colors.menu_inactive_option} value={categoriaDescripcion} onChangeText={setCategoriaDescripcion} />
            <View style={styles.switchContainer}>
                <Text style={styles.text}>Es una categoria secundaria: </Text>
                <Switch thumbColor={mostrarSelector ? colors.primary : colors.menu_inactive_option} trackColor={{ true: colors.primary_degraded }} value={mostrarSelector} onValueChange={setMostrarSelector} />
            </View>
            {mostrarSelector && (
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Seleccione una categoria principal</Text>
                    <Picker style={styles.picker} selectedValue={categoriaPrincipal} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setCategoriaPrincipal(itemValue)} >
                        <Picker.Item label="Ninguna" value={null} />
                        {opcionesCategoria.map((opcion, index) => (
                            <Picker.Item key={index} label={opcion.nombre} value={opcion.id} />
                        ))}
                    </Picker>
                </View>
            )}
            <CustomButton title={estaEditando ? "Editar" : "Crear"} onPress={estaEditando ? editarCategoria : crearCategoria} />
        </View>
    );
};

export default RegisterCategory;