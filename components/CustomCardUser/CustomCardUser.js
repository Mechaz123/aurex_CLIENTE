import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

const DefaultImageUser = require("../../static/img/sin_foto.png");

const CustomCardUser = ({ user, edit, assignRole, generateKey, configureCard, verifyCard }) => {
    const getUserImage = () => {
        if (user.imagen_url == null) {
            return DefaultImageUser;
        } else {
            return { uri: `data:image/png;base64,${user.imagen_url}` };
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image style={styles.image} source={getUserImage()}/>
                <View style={styles.info}>
                    <Text style={styles.name}>{user.nombre} {user.apellido}</Text>
                    <Text style={styles.email}>{user.correo}</Text>
                    <Text style={styles.status}>{user.estado_usuario.nombre}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={edit}>
                    <Text>✏️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity styles={styles.actionButton} onPress={assignRole}>
                    <Text style={styles.icon}>🏷️</Text>
                    <Text style={styles.buttonText}>Asignar rol</Text>
                </TouchableOpacity>
                <TouchableOpacity styles={styles.actionButton} onPress={generateKey}>
                    <Text style={styles.icon}>🔑</Text>
                    <Text style={styles.buttonText}>Generar clave</Text>
                </TouchableOpacity>
                <TouchableOpacity styles={styles.actionButton} onPress={configureCard}>
                    <Text style={styles.icon}>🪪</Text>
                    <Text style={styles.buttonText}>Configurar tarjeta</Text>
                </TouchableOpacity>
                <TouchableOpacity styles={styles.actionButton} onPress={verifyCard}>
                    <Text style={styles.icon}>👁️‍🗨️</Text>
                    <Text style={styles.buttonText}>Verificar tarjeta</Text>
                </TouchableOpacity>
                <TouchableOpacity styles={styles.actionButton}>
                    <Text style={styles.icon}>💸</Text>
                    <Text style={styles.buttonText}>Ingresar Dinero</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomCardUser;