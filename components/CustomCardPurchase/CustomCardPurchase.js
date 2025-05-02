import { Image, Text, View } from "react-native";
import styles from "./styles";

const CustomCardPurchase = ({ title, description, image, price }) => {
    return (
        <View style={styles.card}>
            <Image style={styles.image} source={{ uri: `data:image/png;base64,${image}` }} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.text}>Precio: {price}</Text>
        </View>
    )
}

export default CustomCardPurchase;