import { useEffect, useState } from "react";
import Authentication from "../../services/Authentication";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { Alert, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../styles/colors";
import CustomButton from "../../components/CustomButton/CustomButton";
import Spinner from "react-native-loading-spinner-overlay";

const DepositMoney = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [loading, setLoading] = useState(false);
    const [usuarioPermitido, setUsuarioPermitido] = useState(false);
    const [usuarioCorreo, setUsuarioCorreo] = useState(null);
    const [usuarioNombreUsuario, setUsuarioNombreUsuario] = useState(null);
    const [idCredito, setIdCredito] = useState(null);
    const [montoActual, setMontoActual] = useState(0.00);
    const [montoIngreso, setMontoIngreso] = useState(0.00);

    useEffect(() => {
        verificarRolesPropietario();
        consultarUsuario();
        consultarMonto();
        return (() => {
            ID = undefined;
            setLoading(false);
            setUsuarioPermitido(false);
            setUsuarioCorreo(null);
            setUsuarioNombreUsuario(null);
            setIdCredito(null);
            setMontoActual(0.00);
            setMontoIngreso(0.00);
        })
    }, [route.params]);

    const verificarRolesPropietario = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `credito/verificar_roles/${ID}`);

            if (response.Success) {
                if (response.Data == true) {
                    setUsuarioPermitido(true);
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "El usuario no cuenta con alguno de los siguientes roles activos:\n\n- Comprador\n- Vendedor");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo verificar los roles del usuario.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const consultarUsuario = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/consultar/${ID}`);

            if (response.Success) {
                setUsuarioCorreo(response.Data.correo);
                setUsuarioNombreUsuario(response.Data.nombre_usuario);
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

    const consultarMonto = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `credito/consultar_monto/${ID}`);

            if (response.Success) {
                setMontoActual(response.Data.monto);
                setIdCredito(response.Data.id);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Ocurrió un error al consultar el monto actual del usuario, por favor intente de nuevo.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const ingresarMonto = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            if (montoIngreso > 0) {
                const montoTotal = parseFloat(montoIngreso) + parseFloat(montoActual);
                const data= {
                    "monto": montoTotal
                }

                const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `credito/${idCredito}`, data);

                if (response.Success) {
                    const dataMensaje = {
                        "to": usuarioCorreo,
                        "subject": "INGRESO DE DINERO A CUENTA",
                        "content": {
                            "nombre_usuario": usuarioNombreUsuario,
                            "monto_ingreso": parseFloat(montoIngreso)
                        }
                    }

                    const responseMensaje = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_MID_URL, `email/enviar`, dataMensaje);

                    if (responseMensaje.Success) {
                        setLoading(false);
                        Alert.alert("EXITO ✅", "El dinero ha sido ingresado.");
                        navigation.replace("Menu");
                    } else {
                        setLoading(false);
                        Alert.alert("WARNING ⚠️", "Ocurrió un error al enviar el correo al usuario, pero el dinero ya fue ingresado.");
                    }
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "Ocurrió un error al intentar ingresar el dinero, por favor intente de nuevo.");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "Debe ingresar un valor mayor a 0 para registrar el dinero.");
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
            <Text style={styles.title}>💸 Ingresar Dinero</Text>
            {usuarioPermitido && (
                <>
                    <Text style={styles.textEmail}>Correo: {usuarioCorreo}</Text>
                    <Text style={styles.textMonto}>Monto actual: {montoActual}</Text>
                    <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Monto" placeholderTextColor={colors.menu_inactive_option} value={montoIngreso} onChangeText={setMontoIngreso} />
                    <CustomButton title="Ingresar dinero" onPress={ingresarMonto} />
                </>
            )}
        </View>
    )
}

export default DepositMoney;