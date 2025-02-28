import { Image, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import { useCallback, useState } from "react";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from 'react-native-fs';
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const RegisterUser = ({ navigation }) => {
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

    useFocusEffect(
        useCallback(() => {
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
            })
        }, [])
    )

    const cargarOpcionesEstadoUsuario = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `estado_usuario`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOpcionesEstadoUsuario(response.Data);
                }
            } else {
                Alert.alert("ERROR ❌", "No se pudo cargar las opciones de estado del usuario.");
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
                    setUsuarioImagen(base64Imagen);
                } catch (error) {
                    Alert.alert("ERROR ❌", "No se pudo guardar la imagen.");
                }
            }
        })
    }

    const crearUsuario = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            navigation.replace("WriteCard");
        } else {
            navigation.replace("Login"); 
        }
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>👤 Registrar Usuarios</Text>
                <TextInput style={styles.textInput} placeholder="Nombre de usuario" placeholderTextColor={colors.menu_inactive_option} value={usuarioNombreUsuario} onChangeText={setUsuarioNombreUsuario} />
                <TextInput keyboardType="email-address" style={styles.textInput} placeholder="Correo" placeholderTextColor={colors.menu_inactive_option} value={usuarioCorreo} onChangeText={setUsuarioCorreo} />
                <TextInput style={styles.textInput} placeholder="Nombres" placeholderTextColor={colors.menu_inactive_option} value={usuarioNombre} onChangeText={setUsuarioNombre} />
                <TextInput style={styles.textInput} placeholder="Apellidos" placeholderTextColor={colors.menu_inactive_option} value={usuarioApellido} onChangeText={setUsuarioApellido} />
                <TextInput style={styles.textInput} placeholder="Dirección" placeholderTextColor={colors.menu_inactive_option} value={usuarioDireccion} onChangeText={setUsuarioDireccion} />
                <TextInput keyboardType="phone-pad" style={styles.textInput} placeholder="Número de contacto" placeholderTextColor={colors.menu_inactive_option} value={usuarioNumeroContacto} onChangeText={setUsuarioNumeroContacto} />
                <Text style={styles.firstTextSelect}>Seleccione el país de residencia</Text>
                <Picker style={styles.picker} selectedValue={usuarioEstado} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setUsuarioEstado(itemValue)}>
                    <Picker.Item label="Ninguno" value={null} />
                    <Picker.Item label="🇨🇴 Colombia" />
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
                <CustomButton title="Crear" onPress={crearUsuario} />
            </View>
        </ScrollView>
    );
}

export default RegisterUser;