import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import colors from "../../styles/colors";
import { format } from 'date-fns';

const CustomCardOrder = ({ detallePedido, confirmarEnvio }) => {
    const formattedDate = () => {
        return format(new Date(detallePedido.pedido.fecha_orden), 'dd/MM/yyyy HH:mm a')
    }
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image style={styles.image} source={{ uri: `data:image/png;base64,${detallePedido.producto.imagen_url}` }} />
                <View style={styles.info}>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Comprador: </Text> {detallePedido.pedido.usuario.nombre} {detallePedido.pedido.usuario.apellido}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Correo: </Text> {detallePedido.pedido.usuario.correo}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Dirección: </Text> {detallePedido.pedido.usuario.direccion}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Fecha orden: </Text> {formattedDate()}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Producto: </Text> {detallePedido.producto.nombre}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Cantidad: </Text> {detallePedido.cantidad}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Monto total: </Text> {detallePedido.pedido.monto_total}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Estado: </Text> {detallePedido.pedido.estado_pedido.nombre}</Text>
                </View>
            </View>
            {(detallePedido.pedido.estado_pedido.nombre == "Activo") && (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={confirmarEnvio}>
                        <Text style={styles.icon}>📨</Text>
                        <Text style={styles.buttonText}>Enviado</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default CustomCardOrder;