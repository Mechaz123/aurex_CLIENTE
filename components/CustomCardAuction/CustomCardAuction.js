import { Image, Text, View } from "react-native";
import styles from "./styles";

const CustomCardAuction = ({ title, description, image, state, price, stock, isSelected }) => {
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

    return (
        <View style={isSelected ? styles.cardSelected : styles.card}>
            <Image style={styles.image} source={{ uri: `data:image/png;base64,${image}` }} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.state}>
                Estado del producto:{" "}
                <Text style={{ color: getStateColor(state), fontWeight: "bold" }}>{state}</Text>
            </Text>
            <Text style={styles.text}>Precio: {price}</Text>
            <Text style={styles.text}>Existencias: {stock}</Text>
        </View>
    );
};

export default CustomCardAuction;