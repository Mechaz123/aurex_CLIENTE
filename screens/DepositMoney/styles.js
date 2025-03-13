import { StyleSheet } from "react-native";
import colors from "../../styles/colors";

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    },
    title: {
        color: colors.text_basic,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textEmail: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 18,
        marginTop: 15,
        marginBottom: 20,
    },
    textMonto: {
        textAlign: 'center',
        color: colors.text_basic,
        fontWeight: 'bold',
        fontSize: 22,
        marginTop: 15,
        marginBottom: 20,
    },
    textInput: {
        color: colors.text_basic,
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        marginBottom: 15,
        marginTop: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
})