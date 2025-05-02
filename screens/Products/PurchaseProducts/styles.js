import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        color: colors.text_basic,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    textSelectContainer: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    picker: {
        width: '80%',
        color: colors.text_basic,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: colors.border,
        overflow: "hidden",
        backgroundColor: colors.white,
        marginBottom: 5,
    },
    text_products: {
        marginBottom: 5,
        color: colors.text_basic,
        fontSize: 18,
        fontWeight: 'bold',
    }
})