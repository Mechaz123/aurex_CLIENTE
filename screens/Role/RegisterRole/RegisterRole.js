import React, { useCallback, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Authentication from "../../../services/Authentication";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import Utils from "../../../services/Utils";
import { useFocusEffect } from "@react-navigation/native";

const RegisterRole = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [rolNombre, setRolNombre] = useState(null);
    const [rolDescripcion, setRolDescripcion] = useState(null);
    const [estaEditando, setEstaEditando] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cargarDataRol();
            return (() => {
                setRolNombre(null);
                setRolDescripcion(null);
                setEstaEditando(false);
                ID = undefined;
            })
        }, [route.params])
    );

    const cargarDataRol = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            if (ID != undefined) {
                setEstaEditando(true);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol/${ID}`);

                if (response.Success) {
                    setRolNombre(response.Data.nombre);
                    setRolDescripcion(response.Data.descripcion);
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
    const crearRol = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const data = {
                "nombre": rolNombre,
                "descripcion": rolDescripcion,
            }

            if (rolNombre) {
                const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol`, data);

                if (response.Success) {
                    Alert.alert("EXITO ✅", "El rol fue creado.");
                    navigation.replace("Menu");
                } else {
                    Alert.alert("ERROR ❌", "El rol no fue creado.");
                }
            } else {
                Alert.alert("ERROR ❌", "Por favor complete los campos.");
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editarRol = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const data = {
                "nombre": rolNombre,
                "descripcion": rolDescripcion,
            }

            if (data.nombre) {
                const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `rol/${ID}`, data);

                if (response.Success) {
                    Alert.alert("EXITO ✅", "El rol fue editado.");
                    navigation.replace("Menu");
                } else {
                    Alert.alert("ERROR ❌", "El rol no fue editado..");
                }
            }
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{estaEditando ? "✏️ Editar Rol" : "✏️ Registrar Rol"}</Text>
            <TextInput style={styles.textInput} placeholder="Nombre" placeholderTextColor={colors.menu_inactive_option} value={rolNombre} onChangeText={setRolNombre} />
            <TextInput style={styles.textArea} multiline={true} numberOfLines={22} placeholder="Descripción" placeholderTextColor={colors.menu_inactive_option} value={rolDescripcion} onChangeText={setRolDescripcion} />
            <CustomButton title={estaEditando ? "Editar" : "Crear"} onPress={estaEditando ? editarRol : crearRol} />
        </View>
    )
}

export default RegisterRole;