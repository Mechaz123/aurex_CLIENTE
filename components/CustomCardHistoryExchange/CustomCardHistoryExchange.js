import { Image, Text, TouchableOpacity, View } from "react-native"
import styles from "./styles"
import colors from "../../styles/colors";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomCardHistoryExchange = ({ historialIntercambio, rechazar, aceptar }) => {
    const [mostrarBotones, setMostrarBotones] = useState(false);

    useFocusEffect(
        useCallback(() => {
            validarBotones();
            return (() => {
                setMostrarBotones(false);
            });
        }, [])
    )

    const validarBotones = async () => {
        const usuarioId = await AsyncStorage.getItem('usuarioId');
        if ((Number(historialIntercambio.intercambio.usuario_solicitante.id) == Number(usuarioId)) && (historialIntercambio.nuevo_estado.nombre == "Activo")) {
            setMostrarBotones(true);
        } else {
            setMostrarBotones(false);
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Solicitud</Text>
            <View style={styles.header}>
                <Image style={styles.image} source={{ uri: `data:image/png;base64,${historialIntercambio.intercambio.producto_solicitante.imagen_url}` }} />
                <View style={styles.info}>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Vendedor: </Text>{historialIntercambio.intercambio.usuario_solicitante.nombre} {historialIntercambio.intercambio.usuario_solicitante.apellido}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Correo: </Text>{historialIntercambio.intercambio.usuario_solicitante.correo}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Producto: </Text> {historialIntercambio.intercambio.producto_solicitante.nombre}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Cantidad: </Text> {historialIntercambio.intercambio.cantidad_solicitada}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Precio unitario: </Text> {historialIntercambio.intercambio.producto_solicitante.precio}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Estado producto: </Text> {historialIntercambio.intercambio.producto_solicitante.estado_producto.nombre}</Text>
                </View>
            </View>
            <Text style={styles.title}>Oferta</Text>
            <View style={styles.header}>
                <Image style={styles.image} source={{ uri: `data:image/png;base64,${historialIntercambio.intercambio.producto_ofrecido.imagen_url}` }} />
                <View style={styles.info}>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Vendedor: </Text>{historialIntercambio.intercambio.usuario_ofertante.nombre} {historialIntercambio.intercambio.usuario_ofertante.apellido}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Correo: </Text>{historialIntercambio.intercambio.usuario_ofertante.correo}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Producto: </Text> {historialIntercambio.intercambio.producto_ofrecido.nombre}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Cantidad: </Text> {historialIntercambio.intercambio.cantidad_ofrecida}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Precio unitario: </Text> {historialIntercambio.intercambio.producto_ofrecido.precio}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Estado producto: </Text> {historialIntercambio.intercambio.producto_ofrecido.estado_producto.nombre}</Text>
                </View>
            </View>
            <Text style={styles.title}>Estado Intercambio: {historialIntercambio.nuevo_estado.nombre}</Text>
            {(mostrarBotones) && (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={rechazar}>
                        <Text style={styles.icon}>🚫</Text>
                        <Text style={styles.buttonText}>Rechazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={aceptar}>
                        <Text style={styles.icon}>✅</Text>
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default CustomCardHistoryExchange;