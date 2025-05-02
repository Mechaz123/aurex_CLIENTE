import React, { useCallback, useState } from "react";
import { Alert, FlatList, Switch, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Picker } from "@react-native-picker/picker";
import colors from "../../styles/colors";
import Authentication from "../../services/Authentication";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton/CustomButton";
import Spinner from "react-native-loading-spinner-overlay";

const RolePermission = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [opcionesRol, setOpcionesRol] = useState([]);
    const [opcionesPermiso, setOpcionesPermiso] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
    const [rolPermiso, setRolPermiso] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [mostrarSwitch, setMostrarSwitch] = useState(false);
    const [mostrarSelector, setMostrarSelector] = useState(false);
    
    useFocusEffect(
        useCallback(() => {
            cargarOpcionesRol();
            cargarOpcionesPermiso();
            return (() => {
                setLoading(false);
                setOpcionesRol([]);
                setOpcionesPermiso([]);
                setRolSeleccionado(null);
                setPermisoSeleccionado(null);
                setRolPermiso([]);
                setMostrarTabla(false);
                setMostrarSwitch(false);
                setMostrarSelector(false);
            });
        }, [])
    );

    const cargarOpcionesRol = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesRol(response.Data);
                } else {
                    setLoading(false);
                    Alert.alert("ADVERTENCIA ⚠️", "No existen roles en el sistema.");
                }
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

    const cargarOpcionesPermiso = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `permiso/activos`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesPermiso(response.Data);
                    setLoading(false);
                } else {
                    setLoading(false);
                    Alert.alert("ADVERTENCIA ⚠️", "No existen permisos activos en el sistema.");
                }
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

    const cargarRolePermiso = async (itemValue) => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            setMostrarSwitch(false);
            setMostrarSelector(false);
            
            if (itemValue != null) {
                setRolSeleccionado(itemValue);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `rol/${itemValue}/permisos`);

                if (response.Success) {
                    if (Object.keys(response.Data).length != 0) {
                        setRolPermiso(response.Data);
                        setMostrarTabla(true);
                        setLoading(false);
                    } else {
                        setRolPermiso([]);
                        setMostrarTabla(false);
                        setLoading(false);
                        Alert.alert("ADVERTENCIA ⚠️", "El rol no tiene permisos o los permisos no se encuentran activos.");
                    }
                    setMostrarSwitch(true);
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "No se pueden cargar los permisos del rol.");
                }
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cambiarEstado = async (ID) => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol_permiso/${ID}`);

            if (response.Success) {
                let DataRolPermiso = response.Data;
                setLoading(false);

                if (DataRolPermiso.activo) {
                    Alert.alert(
                        "INACTIVAR 🚫",
                        "¿Está seguro que desea inactivar el permiso del rol?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    setLoading(true);
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol_permiso/${ID}`);

                                    if (response.Success) {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "El permiso del rol fue inactivado.");
                                        navigation.replace("Menu");
                                    } else {
                                        setLoading(false);
                                        Alert.alert("ERROR ❌", "El permiso del rol no fue inactivado.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                } else {
                    setLoading(false);
                    Alert.alert(
                        "ACTIVO ✅",
                        "Esta seguro que desea activar el permiso del rol?",
                        [
                            {
                                text: "Cancelar",
                                style: "cancel",
                            },
                            {
                                text: "Si",
                                onPress: async () => {
                                    setLoading(true);
                                    DataRolPermiso.activo = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol_permiso/${ID}`, DataRolPermiso);

                                    if (response.Success) {
                                        setLoading(false);
                                        Alert.alert("EXITO ✅", "El permiso del rol fue activado.");
                                        navigation.replace("Menu");
                                    } else {
                                        setLoading(false);
                                        Alert.alert("ERROR ❌", "El permiso del rol no fue activado.");
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

    const crearRolPermiso = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            if (permisoSeleccionado != null) {
                const verificarRolPermisoCreados = rolPermiso.filter((data) => (data.rol.id == rolSeleccionado) && (data.permiso.id == permisoSeleccionado)).length;
                if (verificarRolPermisoCreados == 0) {
                    const data = {
                        "rol": {
                            "id": rolSeleccionado,
                        },
                        "permiso": {
                            "id": permisoSeleccionado,
                        }
                    }

                    const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol_permiso`, data);

                    if (response.Success) {
                        setLoading(false);
                        Alert.alert("EXITO ✅", "El rol-permiso fue creado.");
                        navigation.replace("Menu");
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "El rol-permiso no fue creado.");
                    }
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "El rol-permiso ya existe.");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Por favor seleccione un permiso para el rol.");
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
            <ScrollView>
                <Text style={styles.title}>👮🏻 Gestionar permisos de roles</Text>
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Seleccione un rol para ver sus permisos</Text>
                    <Picker style={styles.picker} selectedValue={rolSeleccionado} dropdownIconColor={colors.primary} onValueChange={(itemValue) => cargarRolePermiso(itemValue)}>
                        {opcionesRol.map((option, index) => (
                            <Picker.Item key={index} label={option.nombre} value={option.id} />
                        ))}
                    </Picker>
                </View>
                {mostrarTabla && (
                    <ScrollView horizontal>
                        <View style={styles.container_table}>
                            <FlatList data={rolPermiso} keyExtractor={(item) => item.id} style={styles.table_row}
                                ListHeaderComponent={() => (
                                    <View style={styles.table}>
                                        <Text style={styles.table_header}>Permiso</Text>
                                        <Text style={styles.table_header}>Estado</Text>
                                        <Text style={styles.table_header}>Acciones</Text>
                                    </View>
                                )} renderItem={({ item }) => (
                                    <View style={styles.table}>
                                        <Text style={styles.table_text}>{item.permiso.nombre}</Text>
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
                        <Text style={styles.text}>¿Añadir nuevo permiso?</Text>
                        <Switch thumbColor={mostrarSelector ? colors.primary : colors.menu_inactive_option} trackColor={{ true: colors.primary_degraded }} value={mostrarSelector} onValueChange={setMostrarSelector} />
                    </View>
                )}
                {mostrarSelector && (
                    <View style={styles.selectContainer}>
                        <Text style={styles.textSelectContainer}>Seleccione el permiso que desea agregar al rol</Text>
                        <Picker style={styles.picker} selectedValue={permisoSeleccionado} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setPermisoSeleccionado(itemValue)}>
                            {opcionesPermiso.map((option, index) => (
                                <Picker.Item key={index} label={option.nombre} value={option.id} />
                            ))}
                        </Picker>
                        <CustomButton title="Añadir permiso" onPress={crearRolPermiso} />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default RolePermission;