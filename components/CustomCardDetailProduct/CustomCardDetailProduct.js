import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useState } from "react";
import CustomButton from "../CustomButton/CustomButton";

const DefaultImageUser = require("../../static/img/sin_foto.png");

const CustomCardDetailProduct = ({ image, name, description, state, price, owner, owner_name }) => {
    const [modalVisible, setModalVisible] = useState(false)

    const getStateColor = (state) => {
        switch (state) {
            case "Nuevo":
                return "green";
            case "Usado":
                return "orange";
            case "Inactivo":
                return "red";
            default:
                return "black";
        }
    };

    const getUserImage = () => {
        if (owner.imagen_url == null) {
            return DefaultImageUser;
        } else {
            return { uri: `data:image/png;base64,${owner.imagen_url}` };
        }
    }

    return (
        <View style={styles.card}>
            <Image style={styles.image} source={{ uri: `data:image/png;base64,${image}` }} />
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.state}>
                Estado del producto:{" "}
                <Text style={{ color: getStateColor(state), fontWeight: "bold" }}>{state}</Text>
            </Text>
            <Text style={styles.text}>Precio: {price}</Text>
            <Text style={styles.text}>Vendedor/a: {owner_name}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.icon_owner}>🪪</Text>
            </TouchableOpacity>
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.container_modal}>
                    <View style={styles.card}>
                        <Image style={styles.image} source={getUserImage()} />
                        <Text style={styles.text}>Nombres: {owner.nombre}</Text>
                        <Text style={styles.text}>Apellidos: {owner.apellido}</Text>
                        <Text style={styles.text}>Correo: {owner.correo}</Text>
                        <Text style={styles.text}>País: {owner.pais}</Text>
                        <Text style={styles.text_modal}>Número telefónico: {owner.numero_contacto}</Text>
                        <CustomButton title={"Cerrar"} onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default CustomCardDetailProduct;