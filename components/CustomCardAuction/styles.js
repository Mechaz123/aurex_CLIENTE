import { StyleSheet } from "react-native";
import colors from "../../styles/colors";

export default StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 10,
    },
    description: {
        fontSize: 10,
        color: "#555",
        marginTop: 5,
        textAlign: 'center',
    },
    state: {
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 5,
        textAlign: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 5,
        textAlign: 'center',
    },
    cardSelected: {
        backgroundColor: colors.primary_degraded,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    }
})