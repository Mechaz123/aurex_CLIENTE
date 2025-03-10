import { useEffect, useState } from "react";
import styles from "./styles";
import { Alert, FlatList, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Authentication from "../../services/Authentication";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../components/CustomButton/CustomButton";

const UserRole = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [usuarioCorreo, setUsuarioCorreo] = useState(null);
    const [usuarioRoles, setUsuarioRoles] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [mostrarSwitch, setMostrarSwitch] = useState(false);
    const [mostrarSelector, setMostrarSelector] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [opcionesRol, setOpcionesRol] = useState([]);

    useEffect(() => {
        consultarUsuario();
        consultarUsuarioRoles();
        cargarOpcionesRoles();
        return (() => {
            ID = undefined;
            setUsuarioCorreo(null);
            setUsuarioRoles([]);
            setMostrarTabla(false);
            setMostrarSwitch(false);
            setMostrarSelector(false);
            setRolSeleccionado(null);
            setOpcionesRol([]);
        })
    }, []);

    const consultarUsuario = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`);

            if (response.Success) {
                setUsuarioCorreo(response.Data.correo);
            } else {
                Alert.alert("ERROR ❌", "Ocurrió un error al consultar al usuario, por favor intente de nuevo.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const consultarUsuarioRoles = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/${ID}/roles`);
            setMostrarSwitch(false);
            setMostrarSelector(false);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setUsuarioRoles(response.Data);
                    setMostrarTabla(true);
                } else {
                    setUsuarioRoles([]);
                    setMostrarTabla(false);
                    Alert.alert("ADVERTENCIA ⚠️", "El usuario no tiene roles asignados.");
                }
                setMostrarSwitch(true);
            } else {
                Alert("ERROR ❌", "No se pueden cargar los roles del usuario.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarOpcionesRoles = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `rol/activos`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesRol(response.Data);
                } else {
                    Alert.alert("ADVERTENCIA ⚠️", "No existen roles activos en el sistema.");
                }
            } else {
                Alert("ERROR ❌", "No se pudo cargar las opciones.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cambiarEstado = async (idUsuarioRol) => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol/${idUsuarioRol}`);

            if (response.Success) {
                let DataUsuarioRol = response.Data;

                if (DataUsuarioRol.activo) {
                    Alert.alert(
                        "INACTIVAR 🚫",
                        "¿Está seguro/a que desea inactivar el rol del usuario?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol/${idUsuarioRol}`);

                                    if (response.Success) {
                                        Alert.alert("EXITO ✅", "El rol del usuario fue inactivado.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "El rol del usuario no fue inactivado.");
                                    }
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        "ACTIVO ✅",
                        "Esta seguro/a que desea activar el rol del usuario?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    DataUsuarioRol.activo = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol/${idUsuarioRol}`, DataUsuarioRol);

                                    if (response.Success) {
                                        Alert.alert("EXITO ✅", "El rol del usuario fue activado.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "El rol del usuario no fue activado.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const crearUsuarioRol = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (rolSeleccionado != null) {
                const verificarUsuarioRolCreados = usuarioRoles.filter((data) => (data.usuario.id == ID) && (data.rol.id == rolSeleccionado)).length;

                if (verificarUsuarioRolCreados == 0) {
                    const data = {
                        "usuario": {
                            "id": ID,
                        },
                        "rol": {
                            "id": rolSeleccionado,
                        }
                    }

                    const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol`, data);

                    if (response.Success) {
                        Alert.alert("EXITO ✅", "El rol para el usuario fue creado.");
                        navigation.replace("Menu");
                    } else {
                        Alert.alert("ERROR ❌", "El rol para el usuario no fue creado.");
                    }
                } else {
                    Alert.alert("ERROR ❌", "El usuario ya tiene este rol.");
                }
            } else {
                Alert.alert("ERROR ❌", "Por favor seleccione rol para el usuario.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏷️ Asignar Rol</Text>
            <Text style={styles.textEmail}>Correo: {usuarioCorreo}</Text>
            {mostrarTabla && (
                <ScrollView horizontal>
                    <View style={styles.container_table}>
                        <Text style={styles.title_table}>Roles asignados al usuario</Text>
                        <FlatList data={usuarioRoles} keyExtractor={(item) => item.id} style={styles.table_row}
                            ListHeaderComponent={() => (
                                <View style={styles.table}>
                                    <Text style={styles.table_header}>Roles</Text>
                                    <Text style={styles.table_header}>Estado</Text>
                                    <Text style={styles.table_header}>Acciones</Text>
                                </View>
                            )} renderItem={({ item }) => (
                                <View style={styles.table}>
                                    <Text style={styles.table_text}>{item.rol.nombre}</Text>
                                    <Text style={styles.table_text}>{item.activo ? "Activo" : "Inactivo"}</Text>
                                    <View style={styles.table_actions}>
                                        <TouchableOpacity style={styles.table_button} onPress={() => cambiarEstado(item.id)}>
                                            <Text style={styles.button_text}>{item.activo ? "🚫" : "✅"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )} />
                    </View>
                </ScrollView>
            )}
            {mostrarSwitch && (
                <View style={styles.switchContainer}>
                    <Text style={styles.text}>¿Añadir nuevo rol?</Text>
                    <Switch thumbColor={mostrarSelector ? colors.primary : colors.menu_inactive_option} trackColor={{ true: colors.primary_degraded }} value={mostrarSelector} onValueChange={setMostrarSelector} />
                </View>
            )}
            {mostrarSelector && (
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Seleccione el rol que desea agregar al usuario</Text>
                    <Picker style={styles.picker} selectedValue={rolSeleccionado} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setRolSeleccionado(itemValue)}>
                        {opcionesRol.map((option, index) => (
                            <Picker.Item key={index} label={option.nombre} value={option.id} />
                        ))}
                    </Picker>
                    <CustomButton title="Añadir rol" onPress={crearUsuarioRol} />
                </View>
            )}
        </View>
    )
}

export default UserRole;