import { useCallback, useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomCardAuction from "../../../components/CustomCardAuction/CustomCardAuction";

const RegisterAuction = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [subastaPrecioInicial, setSubastaPrecioInicial] = useState(null);
    const [subastaFechaInicio, setSubastaFechaInicio] = useState(new Date());
    const [subastaFechaFin, setSubastaFechaFin] = useState(new Date());
    const [subastaProductoSeleccionado, setSubastaProductoSeleccionado] = useState(null);
    const [subastaEstadoSubasta, setSubastaEstadoSubasta] = useState(null);
    const [opcionesProducto, setOpcionesProducto] = useState([]);
    const [mostrarDatePickerInicio, setMostrarDatePickerInicio] = useState(false);
    const [mostrarDatePickerFin, setMostrarDatePickerFin] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cargarProductos();
            cargarEstadoSubasta();
            return (() => {
                setLoading(false);
                setSubastaPrecioInicial(null);
                setSubastaProductoSeleccionado(null);
                setOpcionesProducto([]);
                setMostrarDatePickerInicio(false);
                setSubastaEstadoSubasta(null);
            })
        }, [])
    )

    const cargarProductos = async () => {
        setLoading(true);

        if (await Authentication.verificarTokenGuardado()) {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `producto/subasta/propietario/${usuarioId}`);

            if (response.Success) {
                setOpcionesProducto(response.Data);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar los productos para subastar.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const cargarEstadoSubasta = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `estado_subasta`);

            if (response.Success) {
                const estadoSubastaCreada = response.Data.find(estado =>
                    estado.nombre == "Creada" && estado.activo
                );
                setSubastaEstadoSubasta(estadoSubastaCreada.id);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "No se pudo cargar los estados de la subasta.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const ajustarFechaColombia = (fecha) => {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setHours(nuevaFecha.getHours() - nuevaFecha.getTimezoneOffset() / 60 - 5);
        return nuevaFecha.toISOString().slice(0, 19).replace("T", " ");
    };

    const crearSubasta = async () => {
        if (subastaPrecioInicial && subastaFechaInicio && subastaFechaFin && subastaProductoSeleccionado) {
            if (subastaProductoSeleccionado.estado_producto.nombre != "Inactivo") {
                if (subastaPrecioInicial > 0) {
                    if (await Authentication.verificarTokenGuardado()) {
                        const data = {
                            producto: {
                                id: subastaProductoSeleccionado.id
                            },
                            precio_inicial: subastaPrecioInicial,
                            precio_actual: subastaPrecioInicial,
                            fecha_inicio: ajustarFechaColombia(subastaFechaInicio),
                            fecha_fin: ajustarFechaColombia(subastaFechaFin),
                            estado_subasta: {
                                id: subastaEstadoSubasta 
                            }
                        }
                        navigation.navigate("VerifyAuction", data);
                    } else {
                        setLoading(false);
                        Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
                        navigation.replace("Login");
                    }
                } else {
                    setLoading(false);
                    Alert.alert("ERROR ❌", "El valor del precio inicial debe ser mayor a cero.");
                }
            } else {
                setLoading(false);
                Alert.alert("ERROR ❌", "El estado del producto no puede ser inactivo.");
            }
        } else {
            setLoading(false);
            Alert.alert("ERROR ❌", "Por favor complete cada uno de los formularios para crear la subasta.");
        }
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} textContent={"Cargando..."} textStyle={{ color: colors.white }} overlayColor="rgba(0,0,0,0.5)" />
            <Text style={styles.title}>🎟️ Registrar Subasta</Text>
            <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Precio Inicial" placeholderTextColor={colors.menu_inactive_option} value={subastaPrecioInicial} onChangeText={setSubastaPrecioInicial} />
            <View style={styles.buttonPicker}>
                <CustomButton title="Seleccionar fecha inicio" onPress={() => setMostrarDatePickerInicio(true)} />
                <DatePicker modal open={mostrarDatePickerInicio} date={subastaFechaInicio} locale="es-CO"
                    onConfirm={(subastaFechaInicio) => {
                        setMostrarDatePickerInicio(false);
                        setSubastaFechaInicio(subastaFechaInicio);
                    }}
                    onCancel={() => {
                        setMostrarDatePickerInicio(false);
                    }}
                />
            </View>
            <View style={styles.buttonPicker}>
                <CustomButton title="Seleccionar fecha fin" onPress={() => setMostrarDatePickerFin(true)} />
                <DatePicker modal open={mostrarDatePickerFin} date={subastaFechaFin} locale="es-CO"
                    onConfirm={(subastaFechaFin) => {
                        setMostrarDatePickerFin(false);
                        setSubastaFechaFin(subastaFechaFin);
                    }}
                    onCancel={() => {
                        setMostrarDatePickerFin(false);
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.textSelectContainer}>Seleccione el producto que desea poner en subasta.</Text>
                <FlatList data={opcionesProducto} keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSubastaProductoSeleccionado(item)}>
                            <CustomCardAuction
                                title={item.nombre}
                                description={item.descripcion}
                                image={item.imagen_url}
                                state={item.estado_producto.nombre}
                                price={item.precio}
                                stock={item.existencias}
                                isSelected={subastaProductoSeleccionado == item}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
            <CustomButton title="Crear Subasta" onPress={() => crearSubasta()} />
        </View>
    )
}

export default RegisterAuction;