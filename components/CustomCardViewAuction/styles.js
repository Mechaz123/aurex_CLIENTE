import { StyleSheet } from "react-native";
import colors from "../../styles/colors";

export default StyleSheet.create({
    card: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: colors.white,
    },
    image: {
        backgroundColor: colors.white,
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    text: {
        color: colors.menu_inactive_option,
        fontSize: 11,
    },
    actions: {
        flexDirection: "row",
    },
    actionButton: {
        flex: 1,
        padding: 10,
        alignItems: "center",
    },
    icon: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 50,
        marginRight: 10,
    },
    buttonText: {
        marginRight: 10,
        color: colors.white,
        fontSize: 20,
        fontWeight: "bold",
    }
})