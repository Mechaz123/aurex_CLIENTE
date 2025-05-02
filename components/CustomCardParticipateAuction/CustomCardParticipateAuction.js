import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import colors from "../../styles/colors";
import { format } from "date-fns";

const CustomCardParticipateAuction = ({ subasta, puja }) => {
    const formattedDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy HH:mm a');
    }

    const CurrentWinner = () => {
        if (Object.keys(subasta.pujas).length != 0) {
            const puja = subasta.pujas.find(puja => puja.activo);
            return (puja.usuario.nombre + " " + puja.usuario.apellido);
        } else {
            return "Ninguno";
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image style={styles.image} source={{ uri: `data:image/png;base64,${subasta.producto.imagen_url}` }} />
                <View style={styles.info}>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Producto: </Text>{subasta.producto.nombre}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Actual ganador: </Text>{CurrentWinner()}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Precio actual: </Text>{subasta.precio_actual}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Propietario subasta: </Text>{subasta.producto.propietario.nombre} {subasta.producto.propietario.apellido}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Fecha inicio: </Text>{formattedDate(subasta.fecha_inicio)}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Fecha fin: </Text>{formattedDate(subasta.fecha_fin)}</Text>
                    <Text style={styles.text}><Text style={{ color: colors.white, fontWeight: 'bold' }}>Estado subasta: </Text>{subasta.estado_subasta.nombre}</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={puja}>
                    <Text style={styles.icon}>🤚</Text>
                    <Text style={styles.buttonText}>Participar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomCardParticipateAuction;