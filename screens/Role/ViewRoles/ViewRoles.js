import React, { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import styles from "./styles";

const ViewRoles = ({ navigation }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        cargarRoles();
        return (() => {
            setRoles([]);
        })
    }, []);

    const cargarRoles = async () => {
        if (Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol`);

            if (response.Success) {
                setRoles(response.Data);
            } else {
                Alert.alert("ERROR ❌", "No se puede cargar los roles.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const editar = async (ID) => {
        navigation.navigate("RegisterRole", { ID });
    }
    const cambiarEstado = async (ID) => {
        if (Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol/${ID}`);

            if (response.Success) {
                let DataRol = response.Data;

                if (DataRol.activo) {
                    Alert.alert(
                        "INACTIVAR 🚫",
                        "¿Está seguro de inactivar el rol?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol/${ID}`);

                                    if (response.Success) {
                                        Alert.alert("EXITO ✅", "El rol fue inactivado.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "El rol no fue inactivado.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        "ACTIVAR ✅",
                        "¿Esta seguro que desea activar el rol?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    DataRol.activo = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol/${ID}`, DataRol);

                                    if (response.Success) {
                                        Alert.alert("EXITO ✅", "El rol fue activado.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "El rol no fue activado.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
            }
        } else {
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container_title}>
                <Text style={styles.title}>🔍 Ver Roles</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={roles} keyExtractor={(item) => item.id} style={styles.table_row}
                        ListHeaderComponent={() => (
                            <View style={styles.table}>
                                <Text style={styles.table_header}>Nombre</Text>
                                <Text style={styles.table_header}>Descripción</Text>
                                <Text style={styles.table_header}>Estado</Text>
                                <Text style={styles.table_header}> Acciones</Text>
                            </View>
                        )} renderItem={({ item }) => (
                            <View style={styles.table}>
                                <Text style={styles.table_text}>{item.nombre}</Text>
                                <Text style={styles.table_text}>{item.descripcion}</Text>
                                <Text style={styles.table_text}>{item.activo ? "Activo" : "Inactivo"}</Text>
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
}

export default ViewRoles;