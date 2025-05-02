import React, { useCallback, useState } from "react";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "../../../styles/colors";

const ViewCategories = ({ navigation }) => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    useFocusEffect(
        useCallback(() => {
            cargarCategorias();
            return (() => {
                setCategorias([]);
                setLoading(false);
            })
        }, [])
    );

    const cargarCategorias = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria`);

            if (response.Success) {
                setCategorias(response.Data);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las categorias.")
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editar = async (ID) => {
        navigation.navigate("RegisterCategory", { ID });
    }

    const cambiarEstado = async (ID) => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria/${ID}`);

            if (response.Success) {
                setLoading(false);
                let DataCategoria = response.Data;

                if (DataCategoria.activo) {
                    Alert.alert(
                        "INACTIVAR 🚫",
                        "¿Esta seguro/a de inactivar la categoria?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    setLoading(true);
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria/${ID}`);

                                    if (response.Success) {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "La categoria fue inactivada.");
                                        navigation.replace("Menu");
                                    } else {
                                        setLoading(false);
                                        Alert.alert("ERROR ❌", "La categoria no fue inactivada.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        "ACTIVAR ✅",
                        "¿Esta seguro de activar la categoria?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    setLoading(true);
                                    DataCategoria.activo = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `categoria/${ID}`, DataCategoria);

                                    if (response.Success) {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "La categoria fue activada.");
                                        navigation.replace("Menu");
                                    } else {
                                        setLoading(false);
                                        Alert.alert("ERROR ❌", "La categoria no fue activada.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
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
                <Text style={styles.title}>🔍 Ver Categorias</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={categorias} keyExtractor={(item) => item.id} style={styles.table_row}
                        ListHeaderComponent={() => (
                            <View style={styles.table}>
                                <Text style={styles.table_header}>Nombre</Text>
                                <Text style={styles.table_header}>Descripción</Text>
                                <Text style={styles.table_header}>Estado</Text>
                                <Text style={styles.table_header}>Categoria principal</Text>
                                <Text style={styles.table_header}>Acciones</Text>
                            </View>
                        )} renderItem={({ item }) => (
                            <View style={styles.table}>
                                <Text style={styles.table_text}>{item.nombre}</Text>
                                <Text style={styles.table_text}>{item.descripcion}</Text>
                                <Text style={styles.table_text}>{item.activo ? "Activo" : "Inactivo"}</Text>
                                <Text style={styles.table_text}>{item.categoria_principal?.nombre ? item.categoria_principal.nombre : "Ninguno"}</Text>
                                <View style={styles.table_actions}>
                                    <TouchableOpacity style={styles.table_button} onPress={() => editar(item.id)}>
                                        <Text style={styles.button_text}>✏️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button} onPress={() => cambiarEstado(item.id)}>
                                        <Text style={styles.button_text}>{item.activo ? "🚫" : "✅"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )} />
                </View>
            </ScrollView>
        </View>
    )
};

export default ViewCategories;