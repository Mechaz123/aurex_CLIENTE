import { Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import colors from "../../../styles/colors";

const UserManagement = ({ navigation }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarUsuarios();
            return (() => {
                setUsuarios([]);
                setUsuariosFiltrados([]);
            })
        }, [])
    );

    const cargarUsuarios = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario`);

            if (response.Success) {
                setUsuarios(response.Data);
                setUsuariosFiltrados(response.Data);
            } else {
                Alert.alert("ERROR ❌", "No se pudo cargar los usuarios.")
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const filtrarUsuarios = async (valor) => {
        if (await Authentication.verificarTokenGuardado()) {
            if (valor != '') {
                const resultadoFiltro = usuarios.filter(usuario =>
                    usuario.correo.toLowerCase().includes(valor.toLowerCase())
                );
                setUsuariosFiltrados(resultadoFiltro);
            } else {
                setUsuariosFiltrados(usuarios);
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editar = async (ID) => {
        navigation.navigate("RegisterUsers", { ID });
    }

    const AsignarUsuarioRol = async (ID) => {
        navigation.navigate("UserRole", { ID });
    }

    const generarNuevaClave = async (ID) => {
        if (await Authentication.verificarTokenGuardado()) {
            const responseGet = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`);

            if (responseGet.Success) {
                Alert.alert(
                    "GENERAR NUEVA CLAVE 🔑",
                    "¿Esta seguro/a de generar una nueva clave para el usuario?",
                    [
                        {
                            text: "Cancelar",
                            style: "cancel",
                        },
                        {
                            text: "Si",
                            onPress: async () => {
                                const data = {
                                    "clave": responseGet.Data.nombre_usuario,
                                }

                                const responsePut = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`, data);

                                if (responsePut.Success) {
                                    Alert.alert("EXITO ✅", "Se ha generado una nueva clave para el usuario.");
                                } else {
                                    Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
                                }
                            }
                        }
                    ]
                )
            } else {
                Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const escribirTarjeta = async (idUsuario) => {
        const ID = idUsuario;
        navigation.replace("WriteCardUserManagement", { ID });
    }

    const verificarTarjeta = async (idUsuario) => {
        const ID = idUsuario;
        navigation.replace("ReadCardUserManagement", { ID });
    }

    return (
        <View style={styles.container}>
            <View style={styles.container_title}>
                <Text style={styles.title}>🧑🏻‍💻 Gestionar Usuarios</Text>
            </View>
            <View style={styles.container_search}>
                <TextInput style={styles.textInput} placeholder="Buscar" placeholderTextColor={colors.menu_inactive_option} onChangeText={(valor) => filtrarUsuarios(valor)} />
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={usuariosFiltrados} keyExtractor={(item) => item.id} style={styles.table_row}
                        ListHeaderComponent={() => (
                            <View style={styles.table}>
                                <Text style={styles.table_header_large}>Correo</Text>
                                <Text style={styles.table_header}>Estado</Text>
                                <Text style={styles.table_header_actions}>Acciones</Text>
                            </View>
                        )} renderItem={({ item }) => (
                            <View style={styles.table}>
                                <Text style={styles.table_text_large}>{item.correo}</Text>
                                <Text style={styles.table_text}>{item.estado_usuario.nombre}</Text>
                                <View style={styles.table_actions}>
                                    <TouchableOpacity style={styles.table_button} onPress={() => editar(item.id)}>
                                        <Text style={styles.button_text}>✏️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button} onPress={() => AsignarUsuarioRol(item.id)}>
                                        <Text style={styles.button_text}>🏷️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button} onPress={() => generarNuevaClave(item.id)}>
                                        <Text style={styles.button_text}>🔑</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button} onPress={() => escribirTarjeta(item.id)}>
                                        <Text style={styles.button_text}>✍🏻</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button} onPress={() => verificarTarjeta(item.id)}>
                                        <Text style={styles.button_text}>🕵🏻</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button}>
                                        <Text style={styles.button_text}>💸</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )} />
                </View>
            </ScrollView>
        </View>
    )
}

export default UserManagement;