import { useEffect, useState } from "react";
import styles from "./styles";
import { Alert, FlatList, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Authentication from "../../services/Authentication";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../components/CustomButton/CustomButton";
import Spinner from "react-native-loading-spinner-overlay";

const UserRole = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
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
            setLoading(false);
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
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/consultar/${ID}`);

            if (response.Success) {
                setUsuarioCorreo(response.Data.correo);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Ocurrió un error al consultar al usuario, por favor intente de nuevo.");
            }
        } else {
            setLoading(false);
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
                    setLoading(false);
                } else {
                    setUsuarioRoles([]);
                    setMostrarTabla(false);
                    setLoading(false);
                    Alert.alert("ADVERTENCIA ⚠️", "El usuario no tiene roles asignados.");
                }
                setMostrarSwitch(true);
            } else {
                setLoading(false);
                Alert("ERROR ❌", "No se pueden cargar los roles del usuario.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarOpcionesRoles = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `rol/activos`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesRol(response.Data);
                    setLoading(false);
                } else {
                    setLoading(false);
                    Alert.alert("ADVERTENCIA ⚠️", "No existen roles activos en el sistema.");
                }
            } else {
                setLoading(false);
                Alert("ERROR ❌", "No se pudo cargar las opciones.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cambiarEstado = async (idUsuarioRol) => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol/${idUsuarioRol}`);

            if (response.Success) {
                setLoading(false);
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
                                    setLoading(true);
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol/${idUsuarioRol}`);

                                    if (response.Success) {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "El rol del usuario fue inactivado.");
                                        navigation.replace("Menu");
                                    } else {
                                        setLoading(false);
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
                                    setLoading(true);
                                    DataUsuarioRol.activo = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol/${idUsuarioRol}`, DataUsuarioRol);

                                    if (response.Success) {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "El rol del usuario fue activado.");
                                        navigation.replace("Menu");
                                    } else {
                                        setLoading(false);
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
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const crearUsuarioRol = async () => {
        setLoading(true);

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

                    const responseUsuarioRol = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario_rol`, data);

                    if (responseUsuarioRol.Success) {
                        const responseVerificacionRoles = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `credito/verificar_roles/${data.usuario.id}`);

                        if (responseVerificacionRoles.Success) {
                            if (responseVerificacionRoles.Data == true) {
                                const responseVerificacionRegistro = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `credito/verificar_registro/${data.usuario.id}`);

                                if (responseVerificacionRegistro.Success) {
                                    if (responseVerificacionRegistro.Data == true) {
                                        const dataCredito = {
                                            "usuario": {
                                                "id": ID
                                            },
                                            "monto": 0
                                        }

                                        const responseCredito = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `credito`, dataCredito);

                                        if (responseCredito.Success) {
                                            setLoading(false);
                                            Alert.alert("EXITO ✅", "El rol para el usuario fue creado.");
                                            navigation.replace("Menu");
                                        } else {
                                            setLoading(false);
                                            Alert.alert("ERROR ❌", "Ocurrió un error al crear el credito del usuario.");
                                        }
                                    } else {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "El rol para el usuario fue creado.");
                                        navigation.replace("Menu");
                                    }

                                } else {
                                    setLoading(false);
                                    Alert.alert("ERROR ❌", "Ocurrió un error al verificar el registro del credito.");
                                }
                            } else {
                                setLoading(false);
                                Alert.alert("EXITO ✅", "El rol para el usuario fue creado.");
                                navigation.replace("Menu");
                            }
                        } else {
                            setLoading(false);
                            Alert.alert("ERROR ❌", "Ocurrió un error al verificar el rol para el registro del credito.");
                        }
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "El rol para el usuario no fue creado.");
                    }
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "El usuario ya tiene este rol.");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Por favor seleccione rol para el usuario.");
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