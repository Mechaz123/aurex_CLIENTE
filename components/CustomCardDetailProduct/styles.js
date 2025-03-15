import { StyleSheet } from "react-native";

export default StyleSheet.create({
    card: {
        width: '100%',
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
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
        textAlign: 'center',
    },
    state: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    icon_owner: {
        fontSize: 50,
    },
    container_modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    text_modal: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 15,
        textAlign: 'center',
    },
})