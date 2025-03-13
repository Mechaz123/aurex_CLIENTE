import { Alert, FlatList, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import colors from "../../../styles/colors";
import CustomCardUser from "../../../components/CustomCardUser/CustomCardUser";
import Spinner from "react-native-loading-spinner-overlay";

const UserManagement = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

    useFocusEffect(
        useCallback(() => {
            cargarUsuarios();
            return (() => {
                setLoading(false);
                setUsuarios([]);
                setUsuariosFiltrados([]);
            })
        }, [])
    );

    const cargarUsuarios = async () => {
        setLoading(true);
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/todos`);

            if (response.Success) {
                setUsuarios(response.Data);
                setUsuariosFiltrados(response.Data);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar los usuarios.")
            }
        } else {
            setLoading(false);
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
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const responseGet = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/consultar/${ID}`);

            if (responseGet.Success) {
                setLoading(false);
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
                                setLoading(true);
                                const data = {
                                    "clave": responseGet.Data.nombre_usuario,
                                }

                                const responsePut = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `usuario/${ID}`, data);

                                if (responsePut.Success) {
                                    setLoading(false);
                                    Alert.alert("EXITO ✅", "Se ha generado una nueva clave para el usuario.");
                                } else {
                                    setLoading(false);
                                    Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
                                }
                            }
                        }
                    ]
                )
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Ocurrió un error, por favor intente de nuevo.");
            }
        } else {
            setLoading(false);
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

    const IngresarDinero = async (idUsuario) => {
        const ID = idUsuario;
        navigation.navigate("DepositMoney", { ID });
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <View style={styles.container_title}>
                <Text style={styles.title}>🧑🏻‍💻 Gestionar Usuarios</Text>
            </View>
            <View style={styles.container_search}>
                <TextInput style={styles.textInput} placeholder="Buscar" placeholderTextColor={colors.menu_inactive_option} onChangeText={(valor) => filtrarUsuarios(valor)} />
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={usuariosFiltrados} keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CustomCardUser 
                                user={item} edit={() => editar(item.id)}
                                assignRole={() => AsignarUsuarioRol(item.id)}
                                generateKey={() => generarNuevaClave(item.id)}
                                configureCard={() => escribirTarjeta(item.id)}
                                verifyCard={() => verificarTarjeta(item.id)}
                                depositMoney={() => IngresarDinero(item.id)}
                            />
                        )} />
                </View>
            </ScrollView>
        </View>
    )
}

export default UserManagement;