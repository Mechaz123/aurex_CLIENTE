import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import { useCallback, useState } from "react";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from 'react-native-fs';
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Spinner from "react-native-loading-spinner-overlay";

const RegisterUser = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [usuarioNombreUsuario, setUsuarioNombreUsuario] = useState(null);
    const [usuarioCorreo, setUsuarioCorreo] = useState(null);
    const [usuarioNombre, setUsuarioNombre] = useState(null);
    const [usuarioApellido, setUsuarioApellido] = useState(null);
    const [usuarioDireccion, setUsuarioDireccion] = useState(null);
    const [usuarioNumeroContacto, setUsuarioNumeroContacto] = useState(null);
    const [usuarioPais, setUsuarioPais] = useState(null);
    const [usuarioImagen, setUsuarioImagen] = useState(null);
    const [usuarioEstado, setUsuarioEstado] = useState(null);
    const [opcionesEstadoUsuario, setOpcionesEstadoUsuario] = useState([]);
    const [estaEditando, setEstaEditando] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cargarDataUsuario();
            cargarOpcionesEstadoUsuario();
            return (() => {
                setUsuarioNombreUsuario(null);
                setUsuarioCorreo(null);
                setUsuarioNombre(null);
                setUsuarioApellido(null);
                setUsuarioDireccion(null);
                setUsuarioNumeroContacto(null);
                setUsuarioPais(null);
                setUsuarioImagen(null);
                setOpcionesEstadoUsuario([]);
                setEstaEditando(false);
                ID = undefined;
                setLoading(false);
            })
        }, [route.params])
    )

    const cargarDataUsuario = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            if (ID != undefined) {
                setEstaEditando(true);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/consultar/${ID}`);

                if (response.Success) {
                    setUsuarioNombreUsuario(response.Data.nombre_usuario);
                    setUsuarioCorreo(response.Data.correo);
                    setUsuarioNombre(response.Data.nombre);
                    setUsuarioApellido(response.Data.apellido);
                    setUsuarioDireccion(response.Data.direccion);
                    setUsuarioDireccion(response.Data.pais);
                    setUsuarioNumeroContacto(response.Data.numero_contacto);
                    setUsuarioPais(response.Data.pais);
                    setUsuarioEstado(response.Data.estado_usuario.id);

                    if (response.Data.imagen_url != null) {
                        setUsuarioImagen(String(response.Data.imagen_url));
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

    const cargarOpcionesEstadoUsuario = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `estado_usuario`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesEstadoUsuario(response.Data);
                }
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones de estado del usuario.");
            }
        } else {
            setLoading(false);
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
                    setUsuarioImagen(base64Imagen);
                } catch (error) {
                    Alert.alert("ERROR ❌", "No se pudo guardar la imagen.");
                }
            }
        })
    }

    const crearUsuario = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {

            if (usuarioNombreUsuario && usuarioCorreo && usuarioNombre && usuarioApellido && usuarioDireccion && usuarioNumeroContacto && usuarioPais) {
                const data = {
                    "nombre_usuario": usuarioNombreUsuario,
                    "correo": usuarioCorreo,
                    "clave": usuarioNombreUsuario,
                    "nombre": usuarioNombre,
                    "apellido": usuarioApellido,
                    "direccion": usuarioDireccion,
                    "numero_contacto": usuarioNumeroContacto,
                    "pais": usuarioPais,
                    "imagen_url": usuarioImagen,
                    "estado_usuario": {
                        "id": usuarioEstado
                    }
                }
                const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario`, data);

                if (response.Success) {
                    const ID = response.Data.id;
                    setLoading(false);
                    navigation.replace("WriteCard", { ID });
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "El usuario no fue creado.");
                }
            } else {
                setLoading(false);
                Alert.alert(
                    "ERROR ❌",
                    "Complete el formulario, los siguientes campos son requeridos para crear al usuario:\n\n- Nombre de usuario \n- Correo \n- Nombre \n- Apellido \n- Dirección \n- Número de contacto \n- País"
                );
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const editarUsuario = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {

            if (usuarioNombreUsuario && usuarioCorreo && usuarioNombre && usuarioApellido && usuarioDireccion && usuarioNumeroContacto && usuarioPais) {
                const data = {
                    "nombre_usuario": usuarioNombreUsuario,
                    "correo": usuarioCorreo,
                    "nombre": usuarioNombre,
                    "apellido": usuarioApellido,
                    "direccion": usuarioDireccion,
                    "numero_contacto": usuarioNumeroContacto,
                    "pais": usuarioPais,
                    "imagen_url": usuarioImagen,
                    "estado_usuario": {
                        "id": usuarioEstado
                    }
                }
                 const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`, data);

                 if (response.Success) {
                    setLoading(false);
                    Alert.alert("EXITO ✅", "El usuario ha sido editado.");
                    navigation.replace("Menu");
                 } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "El usuario no fue editado.");
                 }
            } else {
                setLoading(false);
                Alert.alert(
                    "ERROR ❌",
                    "Complete el formulario, los siguientes campos son requeridos para crear al usuario:\n\n- Nombre de usuario \n- Correo \n- Nombre \n- Apellido \n- Dirección \n- Número de contacto \n- País"
                );
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
                <Text style={styles.title}>{estaEditando ? "✏️ Editar Usuario" : "👤 Registrar Usuarios"}</Text>
                <TextInput style={styles.textInput} placeholder="Nombre de usuario" placeholderTextColor={colors.menu_inactive_option} value={usuarioNombreUsuario} onChangeText={setUsuarioNombreUsuario} />
                <TextInput keyboardType="email-address" style={styles.textInput} placeholder="Correo" placeholderTextColor={colors.menu_inactive_option} value={usuarioCorreo} onChangeText={setUsuarioCorreo} />
                <TextInput style={styles.textInput} placeholder="Nombres" placeholderTextColor={colors.menu_inactive_option} value={usuarioNombre} onChangeText={setUsuarioNombre} />
                <TextInput style={styles.textInput} placeholder="Apellidos" placeholderTextColor={colors.menu_inactive_option} value={usuarioApellido} onChangeText={setUsuarioApellido} />
                <TextInput style={styles.textInput} placeholder="Dirección" placeholderTextColor={colors.menu_inactive_option} value={usuarioDireccion} onChangeText={setUsuarioDireccion} />
                <TextInput keyboardType="phone-pad" style={styles.textInput} placeholder="Número de contacto" placeholderTextColor={colors.menu_inactive_option} value={usuarioNumeroContacto} onChangeText={setUsuarioNumeroContacto} />
                <Text style={styles.firstTextSelect}>Seleccione el país de residencia</Text>
                <Picker style={styles.picker} selectedValue={usuarioPais} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setUsuarioPais(itemValue)}>
                    <Picker.Item label="Ninguno" value={null} />
                    <Picker.Item label="🇨🇴 Colombia" value="Colombia" />
                </Picker>
                <CustomButton title="📷 Seleccione la imagen" onPress={seleccionarImagen} />
                {usuarioImagen && (
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageTitle}>🖼️ Vista previa</Text>
                        <Image source={{ uri: `data:image/png;base64,${usuarioImagen}` }} style={styles.image} />
                    </View>
                )}
                <Text style={styles.textSelect}>Seleccione el estado del usuario</Text>
                <Picker style={styles.picker} selectedValue={usuarioEstado} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setUsuarioEstado(itemValue)}>
                    <Picker.Item label="Ninguno" value={null} />
                    {opcionesEstadoUsuario.map((option, index) => (
                        <Picker.Item key={index} label={option.nombre} value={option.id} />
                    ))}
                </Picker>
                <CustomButton title={estaEditando ? "Editar" : "Crear"} onPress={estaEditando ? editarUsuario : crearUsuario} />
            </View>
        </ScrollView>
    );
}

export default RegisterUser;