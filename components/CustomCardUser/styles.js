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
        borderRadius: 25,
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        color: colors.white,
        fontSize: 13,
        fontWeight: "bold",
    },
    email: {
        fontSize: 11,
        color: colors.menu_inactive_option,
    },
    status: {
        fontSize: 9,
        color: colors.menu_inactive_option,
    },
    editButton: {
        padding: 5,
    },
    actions: {
        flexDirection: "row",
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.white,
        alignItems: "center",
    },
    icon: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginRight: 20,
    },
    buttonText: {
        marginRight: 10,
        color: colors.white,
        fontSize: 7.5,
        fontWeight: "bold",
    }
})