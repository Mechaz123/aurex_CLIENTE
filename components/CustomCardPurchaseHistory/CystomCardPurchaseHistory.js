import { format } from 'date-fns';
import styles from './styles';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';

const CustomCardPurchaseHistory = ({ detallePedido, confirmarEntrega }) => {
    const formattedDate = () => {
        return format(new Date(detallePedido.pedido.fecha_orden), 'dd/MM/yyyy HH:mm a')
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image style={styles.image} source={{ uri: `data:image/png;base64,${detallePedido.producto.imagen_url}` }} />
                <View style={styles.info}>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Vendedor: </Text>{detallePedido.producto.propietario.nombre} {detallePedido.producto.propietario.apellido}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Correo: </Text>{detallePedido.producto.propietario.correo}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Fecha orden: </Text> {formattedDate()}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Producto: </Text> {detallePedido.producto.nombre}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Cantidad: </Text> {detallePedido.cantidad}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Monto total: </Text> {detallePedido.pedido.monto_total}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Estado: </Text> {detallePedido.pedido.estado_pedido.nombre}</Text>
                </View>
            </View>
            {(detallePedido.pedido.estado_pedido.nombre == "Enviado") && (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={confirmarEntrega}>
                        <Text style={styles.icon}>📦</Text>
                        <Text style={styles.buttonText}>Entregado</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default CustomCardPurchaseHistory;