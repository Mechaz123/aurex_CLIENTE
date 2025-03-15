import { StyleSheet } from "react-native";

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
        width: "100%",
        height: 100,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
    },
    description: {
        fontSize: 10,
        color: "#555",
        marginTop: 5,
        textAlign: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 5,
        textAlign: 'center',
    },
})